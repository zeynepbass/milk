
import {Following,Favorite,Message,DetailsPost,Outlet} from  "@/features/feed/pages"
import {Login,Register,Profile} from "@/features/auth/pages"
import { Container } from "@/shared/layout";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "@/shared/error/index";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <ToastContainer
        toastClassName="rounded-xl shadow-md"
        bodyClassName="text-sm font-medium"
        theme="colored"
      />

      <Routes>
        <Route element={<Container />}>
          <Route path="/" element={<Following />} />
          <Route path="/kesfet" element={<Outlet />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/favoriler" element={<Favorite />} />
          <Route path="/mesajlar" element={<Message />} />
          <Route path="/detay/:id" element={<DetailsPost />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route
          path="/giris-yap"
          element={

              <Login />

          }
        />
        <Route
          path="/uye-ol"
          element={

              <Register />

          }
        />
      </Routes>
    </>
  );
}

export default App;
