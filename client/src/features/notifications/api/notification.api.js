import apiClient from "@/shared/api/apiClient";

export const notificationApi = {
  getNotifications: () => apiClient.get("/posts/notifications"),
  markAsRead: (id) => apiClient.put(`/posts/markAsRead/${id}`),
};
