import { notificationApi } from "../api/notification.api";

const unwrap = async (request) => (await request).data;

export const notificationRepository = {
  getNotifications: () => unwrap(notificationApi.getNotifications()),
  markAsRead: (id) => unwrap(notificationApi.markAsRead(id)),
};
