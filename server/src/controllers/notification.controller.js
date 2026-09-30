import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
  res.json(await notificationService.listNotifications(req.userId));
};

export const markAsRead = async (req, res) => {
  await notificationService.markAsRead(req.userId, req.params.id);
  res.json({ success: true });
};
