import { useQueryClient } from "@tanstack/react-query";
import { useSocketEvent } from "@/shared/socket/SocketProvider";
import { queryKeys } from "@/shared/query/queryKeys";

const upsertNotification = (data, notification) => {
  if (!data?.pages?.length) return data;

  const [first, ...rest] = data.pages.map((page) => ({
    ...page,
    items: page.items.filter((item) => item._id !== notification._id),
  }));

  return { ...data, pages: [{ ...first, items: [notification, ...first.items] }, ...rest] };
};

export function NotificationsRealtimeSync() {
  const queryClient = useQueryClient();

  useSocketEvent("notification:new", ({ notification, unreadCount }) => {
    queryClient.setQueryData(queryKeys.notifications.list(), (data) => upsertNotification(data, notification));
    queryClient.setQueryData(queryKeys.notifications.unreadCount(), unreadCount);
  });

  useSocketEvent("notification:unread-count", ({ unreadCount }) => {
    queryClient.setQueryData(queryKeys.notifications.unreadCount(), unreadCount);
  });

  return null;
}
