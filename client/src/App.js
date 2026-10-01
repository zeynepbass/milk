import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Loading } from "@/shared/components/atoms";
import { useSessionBootstrap } from "@/shared/hooks/useSessionBootstrap";
import { GuestOnly } from "@/shared/layout/GuestOnly";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import "react-toastify/dist/ReactToastify.css";

const lazyNamed = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })));

const AppLayout = lazyNamed(() => import("@/shared/layout/AppLayout"), "AppLayout");
const NotFoundPage = lazyNamed(() => import("@/shared/pages/NotFoundPage"), "NotFoundPage");
const FollowingPage = lazyNamed(() => import("@/features/feed/pages/FollowingPage"), "FollowingPage");
const ExplorePage = lazyNamed(() => import("@/features/feed/pages/ExplorePage"), "ExplorePage");
const FavoritesPage = lazyNamed(() => import("@/features/feed/pages/FavoritesPage"), "FavoritesPage");
const MessagesPage = lazyNamed(() => import("@/features/messages/pages"), "MessagesPage");
const PostDetailPage = lazyNamed(() => import("@/features/posts/pages"), "PostDetailPage");
const AdminPage = lazyNamed(() => import("@/features/organic/pages/AdminPage"), "AdminPage");
const ProfilePage = lazyNamed(() => import("@/features/auth/pages/ProfilePage"), "ProfilePage");

function App() {
  useSessionBootstrap();

  return (
    <>
      <ToastContainer toastClassName="rounded-xl shadow-md" theme="colored" />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<FollowingPage />} />
            <Route path="/kesfet" element={<ExplorePage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/favoriler" element={<FavoritesPage />} />
            <Route path="/mesajlar" element={<MessagesPage />} />
            <Route path="/urun/:id" element={<PostDetailPage />} />
            <Route path="/yonetim" element={<AdminPage />} />
          </Route>

          <Route element={<GuestOnly />}>
            <Route path="/giris-yap" element={<LoginPage />} />
            <Route path="/uye-ol" element={<RegisterPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
