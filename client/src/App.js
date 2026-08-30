import { lazy, Suspense } from "react";
import { Container } from "@/shared/layout";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "@/shared/error/index";
import "react-toastify/dist/ReactToastify.css";

const Following = lazy(() =>
  import("@/features/feed/pages").then((module) => ({
    default: module.Following,
  }))
);

const Outlet = lazy(() =>
  import("@/features/feed/pages").then((module) => ({
    default: module.Outlet,
  }))
);

const FavoritePost = lazy(() =>
  import("@/features/feed/pages").then((module) => ({
    default: module.FavoritePost,
  }))
);

const Message = lazy(() =>
  import("@/features/feed/pages").then((module) => ({
    default: module.ProfilePost,
  }))
);

const DetailsPost = lazy(() =>
  import("@/features/feed/pages").then((module) => ({
    default: module.DetailsPost,
  }))
);

const Login = lazy(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.LoginPost,
  }))
);

const Register = lazy(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.RegisterPost,
  }))
);

const Profile = lazy(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.ProfilePost,
  }))
);



function App() {
  return (
    <>
      <ToastContainer
        toastClassName="rounded-xl shadow-md"
        bodyClassName="text-sm font-medium"
        theme="colored"
      />

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-gray-400">
            Yükleniyor...
          </div>
        }
      >
        <Routes>
          <Route element={<Container />}>
            <Route path="/" element={<Following />} />
            <Route path="/kesfet" element={<Outlet />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/favoriler" element={<FavoritePost />} />
            <Route path="/mesajlar" element={<Message />} />
            <Route path="/detay/:id" element={<DetailsPost />} />
          </Route>

          <Route path="*" element={<NotFound />} />
          <Route path="/giris-yap" element={<Login />} />
          <Route path="/uye-ol" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;