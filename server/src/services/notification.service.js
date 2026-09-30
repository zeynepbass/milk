import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { notFound } from "../utils/AppError.js";
import { paginate } from "../utils/pagination.js";
import { emitToUsers } from "../sockets/emitter.js";
import { followerIds } from "./follow.service.js";

const HOUR = 60 * 60 * 1000;

export const GROUPING_WINDOWS = Object.freeze({
  new_post: 6 * HOUR,
  post_like: 24 * HOUR,
  post_comment: HOUR,
  follow: 24 * HOUR,
});

const ACTOR_FIELDS = "name surname avatar";
const RECIPIENT_BATCH_SIZE = 500;

const actorName = (actor) => [actor?.name, actor?.surname].filter(Boolean).join(" ") || "Bir kullanıcı";

const MESSAGE_BUILDERS = {
  new_post: (name, count) =>
    count > 1 ? `${name} ${count} yeni gönderi paylaştı` : `${name} yeni bir gönderi paylaştı`,
  post_like: (name, count) =>
    count > 1 ? `${name} ve ${count - 1} kişi daha gönderini beğendi` : `${name} gönderini beğendi`,
  post_comment: (name, count) =>
    count > 1 ? `${name} ve ${count - 1} kişi daha gönderine yorum yaptı` : `${name} gönderine yorum yaptı`,
  follow: (name) => `${name} seni takip etmeye başladı`,
};

export const toNotificationView = (notification) => ({
  _id: notification._id,
  type: notification.type,
  actor: notification.actor,
  entity: notification.entity,
  count: notification.count,
  isRead: notification.isRead,
  createdAt: notification.createdAt,
  lastActivityAt: notification.lastActivityAt,
  message: MESSAGE_BUILDERS[notification.type](actorName(notification.actor), notification.count),
});

export const countUnread = (recipientId) => Notification.countDocuments({ recipient: recipientId, isRead: false });

const publish = async (notification) => {
  const [populated, unreadCount] = await Promise.all([
    Notification.findById(notification._id).populate("actor", ACTOR_FIELDS).lean(),
    countUnread(notification.recipient),
  ]);

  emitToUsers([notification.recipient], "notification:new", {
    notification: toNotificationView(populated),
    unreadCount,
  });
};

export const recordNotification = async ({ recipient, actor, type, entity, groupKey }) => {
  if (recipient.toString() === actor.toString()) return null;

  const now = new Date();
  const windowStart = new Date(now.getTime() - GROUPING_WINDOWS[type]);

  const grouped = await Notification.findOneAndUpdate(
    { recipient, groupKey, isRead: false, lastActivityAt: { $gte: windowStart } },
    { $inc: { count: 1 }, $set: { actor, entity, lastActivityAt: now } },
    { returnDocument: "after", sort: { lastActivityAt: -1 } }
  ).lean();

  const notification =
    grouped ??
    (await Notification.create({ recipient, actor, type, entity, groupKey, lastActivityAt: now })).toObject();

  await publish(notification);
  return notification;
};

const collectNewPostRecipients = async (author, province) => {
  const followers = await followerIds(author._id);
  const neighbours = province
    ? await User.find({ province, deletedAt: null, _id: { $ne: author._id } })
        .select("_id")
        .lean()
    : [];

  const unique = new Map();
  [...followers, ...neighbours.map((user) => user._id)].forEach((id) => unique.set(id.toString(), id));
  unique.delete(author._id.toString());

  return [...unique.values()];
};

export const dispatchNewPostNotifications = async (postId) => {
  const post = await Post.findOne({ _id: postId, isActive: true }).lean();
  if (!post) return 0;

  const author = await User.findOne({ _id: post.user, deletedAt: null }).lean();
  if (!author) return 0;

  const recipients = await collectNewPostRecipients(author, post.province);

  for (let index = 0; index < recipients.length; index += RECIPIENT_BATCH_SIZE) {
    const batch = recipients.slice(index, index + RECIPIENT_BATCH_SIZE);

    await Promise.all(
      batch.map((recipient) =>
        recordNotification({
          recipient,
          actor: author._id,
          type: "new_post",
          entity: { kind: "post", id: post._id },
          groupKey: `new_post:${author._id}`,
        })
      )
    );
  }

  return recipients.length;
};

const ACTIVITY_RESOLVERS = {
  post_like: async ({ postId }) => {
    const post = await Post.findById(postId).select("user").lean();
    return post && { recipient: post.user, entity: { kind: "post", id: post._id }, groupKey: `post_like:${post._id}` };
  },
  post_comment: async ({ postId, commentId }) => {
    const post = await Post.findById(postId).select("user").lean();
    return (
      post && {
        recipient: post.user,
        entity: { kind: "comment", id: commentId },
        groupKey: `post_comment:${post._id}`,
      }
    );
  },
  follow: async ({ actorId, targetUserId }) => ({
    recipient: targetUserId,
    entity: { kind: "user", id: actorId },
    groupKey: `follow:${actorId}`,
  }),
};

export const dispatchActivityNotification = async (payload) => {
  const target = await ACTIVITY_RESOLVERS[payload.type](payload);
  if (!target) return null;

  return recordNotification({ ...target, actor: payload.actorId, type: payload.type });
};

export const listNotifications = async (recipientId, { cursor, limit }) => {
  const page = await paginate(
    Notification,
    { recipient: new mongoose.Types.ObjectId(recipientId.toString()) },
    { cursor, limit, field: "lastActivityAt", populate: { path: "actor", select: ACTOR_FIELDS } }
  );

  return { items: page.items.map(toNotificationView), nextCursor: page.nextCursor };
};

const emitUnreadCount = async (recipientId) => {
  emitToUsers([recipientId], "notification:unread-count", { unreadCount: await countUnread(recipientId) });
};

export const markAsRead = async (recipientId, notificationId) => {
  const result = await Notification.updateOne(
    { _id: notificationId, recipient: recipientId },
    { $set: { isRead: true } }
  );

  if (result.matchedCount === 0) {
    throw notFound("Bildirim bulunamadı", "NOTIFICATION_NOT_FOUND");
  }

  await emitUnreadCount(recipientId);
};

export const markAllAsRead = async (recipientId) => {
  const result = await Notification.updateMany({ recipient: recipientId, isRead: false }, { $set: { isRead: true } });
  await emitUnreadCount(recipientId);
  return { updated: result.modifiedCount };
};

export const removeNotificationsOf = (userId, session) =>
  Notification.deleteMany({ $or: [{ recipient: userId }, { actor: userId }] }, { session });
