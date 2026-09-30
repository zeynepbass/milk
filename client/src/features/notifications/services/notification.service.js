import { notificationRepository } from "../repositories/notification.repository";

const ENTITY_PATHS = {
  post: (id) => `/urun/${id}`,
  comment: () => null,
  user: () => "/profil",
};

export const notificationService = {
  getNotifications: ({ cursor } = {}) =>
    notificationRepository.getNotifications(cursor ? { cursor } : undefined),
  getUnreadCount: async () => (await notificationRepository.getUnreadCount()).unreadCount,
  markAsRead: (notificationId) => notificationRepository.markAsRead(notificationId),
  markAllAsRead: () => notificationRepository.markAllAsRead(),
  linkFor: (notification) => ENTITY_PATHS[notification.entity?.kind]?.(notification.entity.id) ?? null,
};
