import { useState, useEffect } from "react";
import * as authRepository from "@/features/auth/repositories/repository";
import { useUserStore } from "@/shared/store/useUserStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/shared/utils/useTheme";

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

      const res = await authRepository.loginService(formData);

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

      const res = await authRepository.registerService(formData);

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
      const res = await authRepository.profileService();
      setProfile(res);
    } catch (error) {
    }
  };

  const handleUpdated = async (e) => {
    e?.preventDefault?.();

    try {
      setLoading(true);

      const res = await authRepository.profileUpdated(profileForm);

      toast.info(res.message || "Başarılı");
      setUser(res.user);

      setButton(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const freezeProfile = async () => {
    try {
      const res = await authRepository.freezeServices();

      setTheme("light");
      localStorage.clear();
      navigate("/giris-yap");

      toast.info(res.message || "Tekrardan görüşmek üzere");
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const deleteProfile = async (id) => {
    try {
      const res = await authRepository.deleteServices(id);

      setTheme("light");
      localStorage.clear();
      navigate("/uye-ol");

      toast.info(res.message || "Aramızdan ayrılmana üzüldük");
    } catch (error) {
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
