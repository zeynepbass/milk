import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary, Footer } from "@/shared/components/organisms";
import { Loading } from "@/shared/components/atoms";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";
import { MessagesRealtimeSync } from "@/features/messages/components/MessagesRealtimeSync";
import { NotificationsRealtimeSync } from "@/features/notifications/components/NotificationsRealtimeSync";
import { Header } from "../Header";

export function AppLayout() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === AUTH_STATUS.booting) {
    return <Loading label="Oturum kontrol ediliyor..." />;
  }

  if (status === AUTH_STATUS.anonymous) {
    return <Navigate to="/giris-yap" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded"
      >
        İçeriğe geç
      </a>
      <MessagesRealtimeSync />
      <NotificationsRealtimeSync />
      <Header />
      <main id="main-content" className="flex-1">
        <ErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
