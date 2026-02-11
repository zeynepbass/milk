import {Container} from "./components/shared/Container"
import Section from "./pages/section"
import Login from "./pages/login/index"
import Register from "./pages/register/index"
import Profile from "./pages/profile/index"
import Favorite from "./pages/favorite/index"
import Dialog from "./pages/dialog/index"
import { Route,Routes } from "react-router-dom";
function App() {
  return (
<Routes>
<Route
  path="/"
  element={
    <Container>
      <Section />
    </Container>
  }
/>
<Route
  path="/giris-yap"
  element={
    <Container>
      <Login /></Container>

  }
/>
<Route
  path="/uye-ol"
  element={
    <Container>
      <Register /></Container>

  }
/>
<Route
  path="/profil"
  element={

    <Container>  <Profile /></Container>

  }
/>
<Route
  path="/ayarlar"
  element={

    <Container> <Profile /></Container>

  }
/>
<Route
  path="/favoriler"
  element={

    <Container>   <Favorite /></Container>

  }
/>
<Route
  path="/mesajlar"
  element={

    <Container> <Dialog /></Container>

  }
/>
</Routes>

  );
}

export default App;
