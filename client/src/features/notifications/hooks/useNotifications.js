import { useState } from "react";
import { postProvider } from "@/providers/post.provider";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const service = postProvider.service;

  const NotificationAlerts = async () => {
    try {
      setLoading(true);

      const res = await service.getNotifications();

      setNotifications([...res].reverse());
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await service.markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {}
  };

  return {
    NotificationAlerts,
    notifications,
    markAsRead,
    loading,
  };
}
