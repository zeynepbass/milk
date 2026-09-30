import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/shared/components/organisms";
import { Loading } from "@/shared/components/atoms";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";
import { Header } from "../Header";

export function AppLayout() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === AUTH_STATUS.booting) {
    return <Loading />;
  }

  if (status === AUTH_STATUS.anonymous) {
    return <Navigate to="/giris-yap" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="container mx-auto">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
