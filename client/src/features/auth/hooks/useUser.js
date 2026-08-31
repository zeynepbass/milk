import { useState, useEffect } from "react";
import {
  loginService,
  registerService,
  profileService,
  profileUpdated,
  freezeServices,
  deleteServices,
} from "@/features/auth/repositories/repository";
import { useUserStore } from "@/shared/store/useUserStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {useTheme} from "@/shared/utils/useTheme"
export default function useUserLogin() {
  const { setTheme } = useTheme();
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [createOpen, createSetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [button, setButton] = useState(true);

  const [profileForm, setProfileForm] = useState({
    avatar: "",
    name: "",
    surname: "",
    email: "",
    role: "",
    province: "",
    district: "",
    dogrulanmisSatici: false,
  });

  const setUser = useUserStore((state) => state.setUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setProfileForm({
        avatar: profile.avatar || "",
        name: profile.name || "",
        surname: profile.surname || "",
        email: profile.email || "",
        role: profile.role || "",
        province: profile.province || "",
        district: profile.district || "",
        following: profile.following || "",
        followers: profile.followers || "",
        organic: profile.organic || "",
        dogrulanmisSatici: profile.dogrulanmisSatici || false,
      });
    }
  }, [profile]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const res = await loginService(formData);

      const { setUser, setToken } = useUserStore.getState();

      setUser(res.user);
      setToken(res.token);

      toast.info(res.message || "Başarılı");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Giriş yapılamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegister = async (formData) => {
    try {
      setLoading(true);

      const res = await registerService(formData);

      toast.info(res.message || "Başarılı");
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
      const res = await profileService();
      setProfile(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdated = async (e) => {
    e.preventDefault();
    console.log("profileForm",profileForm)
    try {
      setLoading(true);
   
      const res = await profileUpdated(profileForm);

      toast.info(res.message || "Başarılı");
      setUser(res.user);

      setButton(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



  const freezeProfile = async () => {
    try {
   const res=   await freezeServices();
      setTheme("light");
      localStorage.clear();
      navigate("/giris-yap");
      toast.info(res.message || "Tekrardan görüşmek üzere");

    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu");
    }
  };

  const deleteProfile = async (id) => {
    try {
    const res=  await deleteServices(id);
    setTheme("light");
      localStorage.clear();
      navigate("/uye-ol");
      toast.info(res.message || "Aramızdan ayrılmana üzüldük");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
    handleSubmitRegister,
    loading,
    profile,
    freezeProfile,
    getProfile,
    profileForm,
    deleteProfile,
    profile,
    showFreezeModal,
    setProfileForm,
    setShowFreezeModal,
    createOpen,
    createSetOpen,
    button,

    setButton,
    handleUpdated,
  };
}
