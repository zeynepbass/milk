import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { authService } from "../services/auth.service";

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (session) => {
      toast.info(session.message || "Giriş başarılı");
      navigate(location.state?.from || "/", { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Giriş yapılamadı")),
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (result) => {
      toast.info(result.message || "Kayıt başarılı");
      navigate("/giris-yap");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Kayıt sırasında hata oluştu")),
  });
}

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => navigate("/giris-yap", { replace: true }),
  });
}
