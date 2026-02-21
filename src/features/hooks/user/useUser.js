import { useState } from "react";
import {
  userLoginService,
  userRegisterService,
  userProfile
} from "../../services/userServices";
import { useUserStore } from "../../../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function useUserLogin() {
    const [showFreezeModal, setShowFreezeModal] = useState(false);
    const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile,setProfile]=useState("")
  const setUser = useUserStore((state) => state.setUser);
  const token = useUserStore((state) => state.token);

  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const res = await userLoginService.postService(formData);
      setUser(res);


      localStorage.setItem("auth-storage", JSON.stringify({
        state: {
          user: res.user,
          token: res.token
        }
      }));

      toast.success(res.message || "Giriş başarılı");
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

      toast.success(res.message || "Kayıt başarılı");
      navigate("/giris-yap");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Kayıt sırasında hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };
  const getProfile = async () => {
    try {
      const res = await userProfile.getService(token);
      setProfile(res);
    } catch (error) {
      console.log(error);
    }
  };
  
  return {
    handleSubmit,
    handleSubmitRegister,
    loading,
    getProfile,
    profile,
    showFreezeModal, setShowFreezeModal,
    open, setOpen
  };
}
