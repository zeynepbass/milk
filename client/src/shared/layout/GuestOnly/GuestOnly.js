import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "@/shared/components/atoms";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";

export function GuestOnly() {
  const status = useAuthStore((state) => state.status);

  if (status === AUTH_STATUS.booting) {
    return <Loading />;
  }

  if (status === AUTH_STATUS.authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
