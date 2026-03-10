import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet, Navigate } from "react-router-dom";
import { getUserFromToken } from "../../src/utils/auth";

export function Container() {
  const user = getUserFromToken();

  if (!user) {

    return <Navigate to="/giris-yap" />;
  }

  return (
    <div className="container mx-auto">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}