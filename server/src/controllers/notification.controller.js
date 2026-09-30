import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
  res.json(await notificationService.listNotifications(req.userId, req.query));
};

export const getUnreadCount = async (req, res) => {
  res.json({ unreadCount: await notificationService.countUnread(req.userId) });
};

export const markAsRead = async (req, res) => {
  await notificationService.markAsRead(req.userId, req.params.id);
  res.json({ success: true });
};

export const markAllAsRead = async (req, res) => {
  res.json(await notificationService.markAllAsRead(req.userId));
};
