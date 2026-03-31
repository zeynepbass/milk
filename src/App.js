import { Container } from "./shared/Container";
import Section from "./pages/section";
import Following from "./pages/following";
import Login from "./pages/login/index";
import Register from "./pages/register/index";
import Profile from "./pages/profile/index";
import NotFound from "./pages/error/index";
import Favorite from "./pages/favorite/index";
import Message from "./pages/message/index";
import Details from "./pages/section/details/index";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
          <Route path="/kesfet" element={<Section />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/favoriler" element={<Favorite />} />
          <Route path="/mesajlar" element={<Message />} />
          <Route path="/detay/:id" element={<Details />} />
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
