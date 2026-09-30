import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AppLayout, GuestOnly } from "@/shared/layout";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { useSessionBootstrap } from "@/shared/hooks/useSessionBootstrap";
import "react-toastify/dist/ReactToastify.css";

const lazyNamed = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })));

const loadFeedPages = () => import("@/features/feed/pages");
const loadAuthPages = () => import("@/features/auth/pages");

const FollowingPage = lazyNamed(loadFeedPages, "FollowingPage");
const ExplorePage = lazyNamed(loadFeedPages, "ExplorePage");
const FavoritesPage = lazyNamed(loadFeedPages, "FavoritesPage");
const MessagesPage = lazyNamed(() => import("@/features/messages/pages"), "MessagesPage");
const PostDetailPage = lazyNamed(() => import("@/features/posts/pages"), "PostDetailPage");
const LoginPage = lazyNamed(loadAuthPages, "LoginPage");
const RegisterPage = lazyNamed(loadAuthPages, "RegisterPage");
const ProfilePage = lazyNamed(loadAuthPages, "ProfilePage");

function App() {
  useSessionBootstrap();

  return (
    <>
      <ToastContainer
        toastClassName="rounded-xl shadow-md"
        bodyClassName="text-sm font-medium"
        theme="colored"
      />

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-gray-400">Yükleniyor...</div>
        }
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<FollowingPage />} />
            <Route path="/kesfet" element={<ExplorePage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/favoriler" element={<FavoritesPage />} />
            <Route path="/mesajlar" element={<MessagesPage />} />
            <Route path="/urun/:id" element={<PostDetailPage />} />
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
