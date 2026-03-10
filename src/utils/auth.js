
import {jwtDecode} from "jwt-decode";
import { useUserStore } from "../store";
export const GetUserFromToken = () => {
    const token = useUserStore((state) => state.token);

  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded; 
  } catch (err) {
    console.error("Token decode hatası:", err);
    return null;
  }
};