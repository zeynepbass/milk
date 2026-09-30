import { notificationApi } from "../api/notification.api";

const unwrap = async (request) => (await request).data;

export const notificationRepository = {
  getNotifications: (params) => unwrap(notificationApi.getNotifications(params)),
  getUnreadCount: () => unwrap(notificationApi.getUnreadCount()),
  markAsRead: (notificationId) => unwrap(notificationApi.markAsRead(notificationId)),
  markAllAsRead: () => unwrap(notificationApi.markAllAsRead()),
};
