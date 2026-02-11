import {Container} from "./components/shared/Container"
import Section from "./pages/section"
import Login from "./pages/login/index"
import Register from "./pages/register/index"
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
  path="/login"
  element={

      <Login />

  }
/>
<Route
  path="/register"
  element={

      <Register />

  }
/>
</Routes>

  );
}

export default App;
