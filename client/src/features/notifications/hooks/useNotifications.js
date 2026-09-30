import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { queryKeys } from "@/shared/query/queryKeys";
import { mapInfiniteItems, pageParamsFromCursor } from "@/shared/query/infinite";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";
import { notificationService } from "../services/notification.service";

export function useNotificationList({ enabled = true } = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: ({ pageParam }) => notificationService.getNotifications({ cursor: pageParam }),
    enabled,
    ...pageParamsFromCursor,
  });
}

export function useUnreadNotificationCount() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    enabled: status === AUTH_STATUS.authenticated,
  });
}

const useOptimisticRead = (mutationFn, markItem, adjustCount) => {
  const queryClient = useQueryClient();
  const listKey = queryKeys.notifications.list();
  const countKey = queryKeys.notifications.unreadCount();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });
      const previous = { list: queryClient.getQueryData(listKey), count: queryClient.getQueryData(countKey) };

      queryClient.setQueryData(listKey, (data) =>
        mapInfiniteItems(data, (item) => markItem(item, variables))
      );
      queryClient.setQueryData(countKey, (count) => adjustCount(count ?? 0, previous.list, variables));

      return previous;
    },
    onError: (error, variables, previous) => {
      queryClient.setQueryData(listKey, previous?.list);
      queryClient.setQueryData(countKey, previous?.count);
      toast.error(getErrorMessage(error, "Bildirim güncellenemedi"));
    },
  });
};

const wasUnread = (list, notificationId) =>
  list?.pages.some((page) => page.items.some((item) => item._id === notificationId && !item.isRead));

export const useMarkNotificationRead = () =>
  useOptimisticRead(
    (notificationId) => notificationService.markAsRead(notificationId),
    (item, notificationId) => (item._id === notificationId ? { ...item, isRead: true } : item),
    (count, list, notificationId) => (wasUnread(list, notificationId) ? Math.max(0, count - 1) : count)
  );

export const useMarkAllNotificationsRead = () =>
  useOptimisticRead(
    () => notificationService.markAllAsRead(),
    (item) => ({ ...item, isRead: true }),
    () => 0
  );
