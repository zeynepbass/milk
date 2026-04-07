import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet, Navigate } from "react-router-dom";
import { GetUserFromToken } from "@/shared/utils/auth";

export function Container() {
  const user = GetUserFromToken();
  if (!user) {
    return <Navigate to="/giris-yap" />;
  }
  return (
    <div className="container mx-auto">
      <Header />
      <div className="h-[100vh]">
      <Outlet />
      </div>

      <Footer />
    </div>
  );
}