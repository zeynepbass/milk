import { Container } from "./components/shared/Container";
import Section from "./pages/section";
import Login from "./pages/login/index";
import Register from "./pages/register/index";
import Profile from "./pages/profile/index";
import Favorite from "./pages/favorite/index";
import Dialog from "./pages/dialog/index";
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
        <Route
          path="/"
          element={
            <Container>
              <Section />
            </Container>
          }
        />
        <Route path="/giris-yap" element={<Login />} />
        <Route path="/uye-ol" element={<Register />} />
        <Route
          path="/profil"
          element={
            <Container>
              {" "}
              <Profile />
            </Container>
          }
        />
        <Route
          path="/ayarlar"
          element={
            <Container>
              {" "}
              <Profile />
            </Container>
          }
        />
        <Route
          path="/favoriler"
          element={
            <Container>
              {" "}
              <Favorite />
            </Container>
          }
        />
        <Route
          path="/mesajlar"
          element={
            <Container>
              {" "}
              <Dialog />
            </Container>
          }
        />
        <Route
          path="/detay/:id"
          element={
            <Container>
              {" "}
              <Details />
            </Container>
          }
        />
      </Routes>
    </>
  );
}

export default App;
