import { useState } from "react";
import {
  userLoginService,
  userRegisterService
} from "../../services/userServices";
import { useUserStore } from "../../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function useUserLogin() {
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const res = await userLoginService.postService(formData);

      setUser(res);
      toast.success(res.message || "Giriş başarılı ");
      navigate("/");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Giriş yapılamadı"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitRegister = async (formData) => {
    try {
      setLoading(true);

      const res = await userRegisterService.postService(formData);

      toast.success(res.message || "Kayıt başarılı ");
      navigate("/giris-yap");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Kayıt sırasında hata oluştu "
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    handleSubmitRegister,
    loading
  };
}
