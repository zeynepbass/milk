import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { notFound } from "../utils/AppError.js";

const todayKey = () => new Date().toISOString().split("T")[0];

const formatMessage = (notification) =>
  notification.type === "new_post"
    ? `İlinde ${notification.name} ${notification.surname} yeni bir gönderi paylaştı`
    : "";

export const listNotifications = async (userId) => {
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();

  return notifications.map((notification) => ({
    _id: notification._id,
    message: formatMessage(notification),
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    postId: notification.postId,
    userId: notification.senderId,
    type: notification.type,
  }));
};

export const markAsRead = async (userId, notificationId) => {
  const result = await Notification.updateOne({ _id: notificationId, userId }, { $set: { isRead: true } });

  if (result.matchedCount === 0) {
    throw notFound("Bildirim bulunamadı", "NOTIFICATION_NOT_FOUND");
  }
};

export const notifyProvinceAboutPost = async (post, author) => {
  if (!post.province) return;

  const date = todayKey();

  const [recipients, alreadyNotified] = await Promise.all([
    User.find({ province: post.province, _id: { $ne: author._id } }).select("_id").lean(),
    Notification.distinct("userId", { type: "new_post", province: post.province, date }),
  ]);

  const notifiedIds = new Set(alreadyNotified.map((id) => id.toString()));

  const notifications = recipients
    .filter((recipient) => !notifiedIds.has(recipient._id.toString()))
    .map((recipient) => ({
      userId: recipient._id,
      senderId: author._id,
      type: "new_post",
      province: post.province,
      date,
      name: author.name,
      surname: author.surname,
      postId: post._id,
    }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
};
