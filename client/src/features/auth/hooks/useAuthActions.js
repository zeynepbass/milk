import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { authService } from "../services/auth.service";

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (credentials) => {
    setLoading(true);

    try {
      const session = await authService.login(credentials);
      toast.info(session.message || "Giriş başarılı");
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Giriş yapılamadı"));
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);

    try {
      const result = await authService.register(payload);
      toast.info(result.message || "Kayıt başarılı");
      navigate("/giris-yap");
    } catch (error) {
      toast.error(getErrorMessage(error, "Kayıt sırasında hata oluştu"));
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading };
}
