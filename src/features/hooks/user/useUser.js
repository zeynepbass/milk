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

  const [createOpen,createSetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState("");
  const [button, setButton] = useState(false);

  const [profileForm, setProfileForm] = useState({
    avatar: "",
    name: "",
    surname: "",
    email: "",
    role: "",
    province:"",
    district:""
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
        followers:profile.followers || ""
      });
    }
  }, [profile]);
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
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const res = await userLoginService.postService(formData);
      setUser(res);

      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            user: res.user,
            token: res.token,
          },
        })
      );

      toast.success(res.message || "Giriş başarılı");

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
  const freezeProfile = async () => {
    try {
      await userProfilFreeze.freezeServices(token);
      navigate("/giris-yap");
      toast.info("Tekrardan görüşmek üzere");

      localStorage.clear();
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu");
    }
  };
const deleteProfile=async(id)=>{
  try {
    await userProfileDeleted.deletedServices(token,id);
    navigate("/uye-ol")
    toast.info("Aramızdan ayrılmana üzüldük :(");

    localStorage.clear();
  } catch (error) {
    console.log(error);
  }
}
  return {
    handleSubmit,
    handleSubmitRegister,
    loading,
    freezeProfile,
    getProfile,
    profileForm,
    deleteProfile,
    showFreezeModal,
    setProfileForm,
    setShowFreezeModal,
    createOpen,createSetOpen,
    button,
    setButton,
    handleUpdated,
  };
}
