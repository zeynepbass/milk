import {Container} from "./components/shared/Container"
import Section from "./pages/section"
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

</Routes>

  );
}

export default App;
