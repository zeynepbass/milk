import Conversation, { buildParticipantsKey } from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { badRequest, notFound } from "../utils/AppError.js";
import { emitToUsers } from "../sockets/emitter.js";

const PARTICIPANT_FIELDS = "name surname avatar";

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

  if (!(await User.exists({ _id: receiverId, status: true }))) {
    throw notFound("Alıcı bulunamadı", "RECEIVER_NOT_FOUND");
  }
};

export const sendMessage = async ({ senderId, receiverId, text }) => {
  await assertValidReceiver(senderId, receiverId);

  const conversation = await findOrCreateConversation(senderId, receiverId);

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    receiverId,
    text,
  });

  await Conversation.updateOne(
    { _id: conversation._id },
    { $set: { lastMessage: text, lastMessageAt: message.createdAt } }
  );

  const payload = message.toObject();
  emitToUsers([senderId, receiverId], "message:new", payload);

  return payload;
};

export const listConversations = (userId) =>
  Conversation.find({ participants: userId })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .populate("participants", PARTICIPANT_FIELDS)
    .lean();

export const getConversationWith = async (userId, otherUserId) => {
  const conversation = await Conversation.findOne({
    $or: [
      { participantsKey: buildParticipantsKey(userId, otherUserId) },
      { participantsKey: { $exists: false }, participants: { $all: [userId, otherUserId], $size: 2 } },
    ],
  })
    .populate("participants", PARTICIPANT_FIELDS)
    .lean();

  if (!conversation) {
    return { _id: null, participants: [], messages: [] };
  }

  const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).lean();

  return { ...conversation, messages };
};
