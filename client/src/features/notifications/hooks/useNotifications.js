import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { notificationService } from "../services/notification.service";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);

    try {
      setNotifications(await notificationService.getNotifications());
    } catch (error) {
      toast.error(getErrorMessage(error, "Bildirimler alınamadı"));
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Bildirim güncellenemedi"));
    }
  };

  return { fetchNotifications, notifications, markAsRead, loading };
}
