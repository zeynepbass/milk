import { Header } from "./Header";
import { Footer } from "./Footer";
export function Container({ children }) {
  
  return (
    <div className="container mx-auto">
      <Header />

      {children}
      <Footer />
    </div>
  );
}
