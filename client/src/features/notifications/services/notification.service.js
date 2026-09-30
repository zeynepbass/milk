import { notificationRepository } from "../repositories/notification.repository";

export const notificationService = {
  getNotifications: () => notificationRepository.getNotifications(),
  markAsRead: (id) => notificationRepository.markAsRead(id),
};
