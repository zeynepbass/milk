import { Navigate, Outlet } from "react-router-dom";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";

export function GuestOnly() {
  const status = useAuthStore((state) => state.status);

  if (status === AUTH_STATUS.authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
