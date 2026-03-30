import { useState, useEffect } from "react";
import {
  userLoginService,
  userRegisterService,
  userProfile,
  userProfileUpdated,
  userProfilFreeze,
  userProfileDeleted
} from "../../services/userServices";
import { useUserStore } from "../../../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function useUserLogin() {
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [createOpen, createSetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [button, setButton] = useState(false);

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
  const token = useUserStore((state) => state.token);
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

      const res = await userLoginService.postService(formData);


      setUser(res.user);

      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            user: res.user,
            token: res.token,
          },
        })
      );

      toast.info(res.message || "Giriş başarılı");
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

      const res = await userRegisterService.postService(formData);

      toast.info(res.message || "Kayıt başarılı");
      navigate("/giris-yap");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Kayıt sırasında hata oluştu");
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

  const handleUpdated = async () => {
    try {
      setLoading(true);
      const res = await userProfileUpdated.postService(profileForm, token);
      setUser(res.user);
      setButton(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const userUpdated = async (formData) => {
    try {
      setLoading(true);
      await userProfileUpdated.postService(formData, token);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const freezeProfile = async () => {
    try {
      await userProfilFreeze.freezeServices(token);
      localStorage.clear();
      navigate("/giris-yap");
      toast.info("Tekrardan görüşmek üzere");
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu");
    }
  };

  const deleteProfile = async (id) => {
    try {
      await userProfileDeleted.deletedServices(token, id);
      localStorage.clear();
      navigate("/uye-ol");
      toast.info("Aramızdan ayrılmana üzüldük :(");
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
    userUpdated,
    setButton,
    handleUpdated,
  };
}