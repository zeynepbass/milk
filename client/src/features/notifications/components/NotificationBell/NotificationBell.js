import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useUnreadNotificationCount } from "../../hooks/useNotifications";
import { NotificationList } from "../NotificationList";

export function NotificationBell() {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const label = unreadCount > 0 ? `Bildirimler, ${unreadCount} okunmamış` : "Bildirimler";

  return (
    <Popover className="relative">
      <PopoverButton
        aria-label={label}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        <BellAlertIcon className="w-5 h-5 text-[rgb(82,144,246)] dark:text-yellow-400" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </PopoverButton>

      <PopoverPanel
        anchor="bottom end"
        className="z-50 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 overflow-hidden"
      >
        {({ close }) => <NotificationList onNavigate={close} />}
      </PopoverPanel>
    </Popover>
  );
}
