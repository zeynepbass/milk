
import jwt_decode from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token"); 
  if (!token) return null;
  try {
    const decoded = jwt_decode(token);
    return decoded; 
  } catch (err) {
    console.error("Token decode hatası:", err);
    return null;
  }
};