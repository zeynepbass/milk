import apiClient from "@/shared/api/apiClient";

export const notificationApi = {
  getNotifications: (params) => apiClient.get("/notifications", { params }),
  getUnreadCount: () => apiClient.get("/notifications/unread-count"),
  markAsRead: (notificationId) => apiClient.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => apiClient.patch("/notifications/read-all"),
};
