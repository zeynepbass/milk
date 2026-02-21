import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
export function Container() {
  
  return (
    <div className="container mx-auto">
      <Header />

      <Outlet />
      <Footer />
    </div>
  );
}
