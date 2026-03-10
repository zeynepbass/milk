
import {jwtDecode} from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token"); 
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded; 
  } catch (err) {
    console.error("Token decode hatası:", err);
    return null;
  }
};