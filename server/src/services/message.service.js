import mongoose from "mongoose";
import Conversation, { buildParticipantsKey } from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { badRequest, notFound } from "../utils/AppError.js";
import { paginate } from "../utils/pagination.js";
import { emitToUsers } from "../sockets/emitter.js";

const PARTICIPANT_FIELDS = "name surname avatar lastSeen";
const CONVERSATION_LIST_LIMIT = 100;

const conversationNotFound = () => notFound("Sohbet bulunamadı", "CONVERSATION_NOT_FOUND");

const findLegacyConversation = (firstUserId, secondUserId) =>
  Conversation.findOne({
    participantsKey: { $exists: false },
    participants: { $all: [firstUserId, secondUserId], $size: 2 },
  });

export const findOrCreateConversation = async (firstUserId, secondUserId) => {
  const participantsKey = buildParticipantsKey(firstUserId, secondUserId);

  const existing = await Conversation.findOne({ participantsKey });
  if (existing) return existing;

  const legacy = await findLegacyConversation(firstUserId, secondUserId);
  if (legacy) {
    legacy.participantsKey = participantsKey;
    await legacy.save();
    return legacy;
  }

  try {
    return await Conversation.findOneAndUpdate(
      { participantsKey },
      { $setOnInsert: { participantsKey, participants: [firstUserId, secondUserId] } },
      { upsert: true, returnDocument: "after" }
    );
  } catch (err) {
    if (err?.code === 11000) return Conversation.findOne({ participantsKey });
    throw err;
  }
};

const assertValidReceiver = async (senderId, receiverId) => {
  if (senderId.toString() === receiverId.toString()) {
    throw badRequest("Kendinize mesaj gönderemezsiniz", "SELF_MESSAGE");
  }

  if (!(await User.exists({ _id: receiverId, status: true, deletedAt: null }))) {
    throw notFound("Alıcı bulunamadı", "RECEIVER_NOT_FOUND");
  }
};

const assertParticipant = async (userId, conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
    hiddenAt: null,
  }).lean();

  if (!conversation) throw conversationNotFound();
  return conversation;
};

const unreadCountsFor = async (userId, conversationIds) => {
  const rows = await Message.aggregate([
    {
      $match: {
        receiverId: new mongoose.Types.ObjectId(userId.toString()),
        readAt: null,
        conversationId: { $in: conversationIds },
      },
    },
    { $group: { _id: "$conversationId", count: { $sum: 1 } } },
  ]);

  return new Map(rows.map((row) => [row._id.toString(), row.count]));
};

export const sendMessage = async ({ senderId, receiverId, text }) => {
  await assertValidReceiver(senderId, receiverId);

  const conversation = await findOrCreateConversation(senderId, receiverId);
  const message = await Message.create({ conversationId: conversation._id, senderId, receiverId, text });

  await Conversation.updateOne(
    { _id: conversation._id },
    { $set: { lastMessage: text, lastMessageAt: message.createdAt, hiddenAt: null } }
  );

  const payload = message.toObject();
  emitToUsers([senderId, receiverId], "message:new", payload);

  return payload;
};

export const listConversations = async (userId) => {
  const conversations = await Conversation.find({ participants: userId, hiddenAt: null })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .limit(CONVERSATION_LIST_LIMIT)
    .populate("participants", PARTICIPANT_FIELDS)
    .lean();

  const unread = await unreadCountsFor(
    userId,
    conversations.map((conversation) => conversation._id)
  );

  return conversations.map((conversation) => ({
    ...conversation,
    unreadCount: unread.get(conversation._id.toString()) ?? 0,
  }));
};

export const getConversationWith = async (userId, otherUserId) => {
  const conversation = await Conversation.findOne({
    hiddenAt: null,
    $or: [
      { participantsKey: buildParticipantsKey(userId, otherUserId) },
      { participantsKey: { $exists: false }, participants: { $all: [userId, otherUserId], $size: 2 } },
    ],
  })
    .populate("participants", PARTICIPANT_FIELDS)
    .lean();

  if (conversation) return conversation;

  const other = await User.findOne({ _id: otherUserId, deletedAt: null }).select(PARTICIPANT_FIELDS).lean();
  if (!other) throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");

  return { _id: null, participants: [other], lastMessage: "", unreadCount: 0 };
};

export const listMessages = async (userId, conversationId, { cursor, limit }) => {
  await assertParticipant(userId, conversationId);

  return paginate(Message, { conversationId: new mongoose.Types.ObjectId(conversationId.toString()) }, {
    cursor,
    limit,
  });
};

export const markConversationRead = async (userId, conversationId) => {
  const conversation = await assertParticipant(userId, conversationId);
  const readAt = new Date();

  const result = await Message.updateMany(
    { conversationId: conversation._id, receiverId: userId, readAt: null },
    { $set: { readAt } }
  );

  if (result.modifiedCount > 0) {
    const others = conversation.participants.filter((id) => id.toString() !== userId.toString());
    emitToUsers(others, "message:read", {
      conversationId: conversation._id.toString(),
      readerId: userId.toString(),
      readAt,
    });
  }

  return { conversationId: conversation._id, updated: result.modifiedCount, readAt };
};

export const hideConversationsOf = (userId, session) =>
  Conversation.updateMany({ participants: userId }, { $set: { hiddenAt: new Date() } }, { session });
