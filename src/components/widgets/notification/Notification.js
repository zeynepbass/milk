import usePost from "@/features/hooks/feed/posts/usePost";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Notifications({ open }) {
  const navigate = useNavigate();
  const {
    NotificationAlerts,
    notifications,
    markAsRead,
    loading,
  } = usePost();

  useEffect(() => {
    NotificationAlerts();
  }, []);

  return (
    <div className="relative">

      {notifications?.some((n) => !n.isRead) && (
        <span className="absolute -top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full" />
      )}

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border z-50 dark:border-none overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-gray-700 dark:text-yellow-400 dark:border-gray-500">
            Bildirimler
          </div>

          <div className="max-h-80 overflow-y-auto dark:bg-dark-800">

            {loading ? (
              <p className="text-center text-gray-400 py-6 text-sm">
                Yükleniyor...
              </p>
            ) : notifications?.length === 0 ? (
   
              <p className="text-center text-gray-400 py-6 text-sm">
                Bildirimin yok
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={async () => {
                    if (item.postId) {
                      await markAsRead(item._id);
                      navigate(`/detay/${item.postId}`);
                    }
                  }}
                  className={`px-4 py-3  dark:bg-dark-800 border-b dark:border-b-gray-900 dark:hover:bg-gray-400 text-sm cursor-pointer hover:bg-gray-50 transition ${
                    !item.isRead ? " dark:bg-dark-800" : ""
                  }`}
                >
                  <p className="text-gray-700 dark:text-gray-200">{item.message}</p>

                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(item.createdAt).toLocaleString("tr-TR")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}