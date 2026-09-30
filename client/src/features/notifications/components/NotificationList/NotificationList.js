import { Link } from "react-router-dom";
import { LoadMore, QueryState } from "@/shared/components/molecules";
import { flattenPages } from "@/shared/query/infinite";
import { notificationService } from "../../services/notification.service";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationList,
} from "../../hooks/useNotifications";

const formatDate = (value) => new Date(value).toLocaleString("tr-TR");

function NotificationItem({ notification, onOpen }) {
  const link = notificationService.linkFor(notification);
  const className = `block w-full text-left px-4 py-3 border-b dark:border-gray-700 text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 ${
    notification.isRead ? "" : "bg-blue-50 dark:bg-gray-900"
  }`;
  const content = (
    <>
      <span className="block text-gray-700 dark:text-gray-200">{notification.message}</span>
      <span className="text-xs text-gray-500 mt-1 block">{formatDate(notification.lastActivityAt)}</span>
    </>
  );

  return link ? (
    <Link to={link} className={className} onClick={onOpen}>
      {content}
    </Link>
  ) : (
    <button type="button" className={className} onClick={onOpen}>
      {content}
    </button>
  );
}

export function NotificationList({ onNavigate }) {
  const query = useNotificationList();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications = flattenPages(query.data);

  const open = (notification) => {
    if (!notification.isRead) markRead.mutate(notification._id);
    onNavigate?.();
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
        <h2 className="font-semibold text-gray-700 dark:text-yellow-400">Bildirimler</h2>
        {notifications.some((item) => !item.isRead) && (
          <button
            type="button"
            className="text-xs text-blue-600 dark:text-yellow-400 hover:underline"
            onClick={() => markAllRead.mutate()}
          >
            Tümünü okundu yap
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        <QueryState
          query={query}
          isEmpty={notifications.length === 0}
          empty={<p className="text-center text-gray-500 py-6 text-sm">Bildirimin yok</p>}
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onOpen={() => open(notification)}
            />
          ))}
          <LoadMore query={query} label="Daha eski bildirimler" />
        </QueryState>
      </div>
    </div>
  );
}
