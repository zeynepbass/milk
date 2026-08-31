import { Header, Footer } from "@/shared/components/organism";
import { Outlet, Navigate } from "react-router-dom";
import { GetUserFromToken } from "@/shared/utils/auth";

export function Container() {
  const user = GetUserFromToken();
  if (!user) {
    return <Navigate to="/giris-yap" />;
  }
  return (
    <div className="container mx-auto ">
      <Header />
      <Outlet />

      <Footer />
    </div>
  );
}
