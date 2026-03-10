import { Navigate, Outlet } from "react-router-dom";
import useUserLogin from "features/hooks/user/useUser";

export function Container({ allowedRoles = [] }) {
  const { user } = useUserLogin();

  if (!user) return <Navigate to="/login" />;


  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="container mx-auto">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}