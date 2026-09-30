import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/shared/api/apiClient";
import { useTheme } from "@/shared/hooks/useTheme";
import { accountService } from "../services/account.service";

const EMPTY_FORM = {
  avatar: "",
  name: "",
  surname: "",
  email: "",
  role: "",
  province: "",
  district: "",
  following: [],
  followers: [],
  organic: "",
  dogrulanmisSatici: false,
  currentPassword: "",
};

const toForm = (profile) => ({
  ...EMPTY_FORM,
  ...Object.fromEntries(Object.entries(profile).filter(([key]) => key in EMPTY_FORM)),
  following: profile.following ?? [],
  followers: profile.followers ?? [],
  currentPassword: "",
});

export function useProfile() {
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [createOpen, createSetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [button, setButton] = useState(true);
  const [profileForm, setProfileForm] = useState(EMPTY_FORM);

  const getProfile = useCallback(async () => {
    try {
      setProfile(await accountService.getMe());
    } catch (error) {
      toast.error(getErrorMessage(error, "Profil bilgileri alınamadı"));
    }
  }, []);

  useEffect(() => {
    if (profile) setProfileForm(toForm(profile));
  }, [profile]);

  const emailChanged = Boolean(profile) && profileForm.email.trim().toLowerCase() !== profile.email;

  const handleUpdated = async (event) => {
    event?.preventDefault?.();
    setLoading(true);

    try {
      const { changed } = await accountService.saveProfile(profileForm, profile);

      if (emailChanged) {
        await accountService.changeEmail(profileForm.email, profileForm.currentPassword);
      }

      if (changed || emailChanged) toast.info("Profil güncellendi");

      await getProfile();
      setButton(true);
    } catch (error) {
      toast.error(getErrorMessage(error, "Profil güncellenemedi"));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (file) => {
    if (!file) return;

    try {
      const user = await accountService.updateAvatar(file);
      setProfile((prev) => ({ ...prev, avatar: user.avatar }));
      toast.info("Profil fotoğrafı güncellendi");
    } catch (error) {
      toast.error(getErrorMessage(error, "Profil fotoğrafı yüklenemedi"));
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await accountService.changePassword(currentPassword, newPassword);
      toast.info("Şifreniz güncellendi");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Şifre güncellenemedi"));
      return false;
    }
  };

  const leave = (path, message) => {
    setTheme("light");
    navigate(path, { replace: true });
    toast.info(message);
  };

  const freezeProfile = async () => {
    try {
      const result = await accountService.freeze();
      leave("/giris-yap", result.message || "Tekrardan görüşmek üzere");
    } catch (error) {
      toast.error(getErrorMessage(error, "Bir hata oluştu"));
    }
  };

  const deleteProfile = async (password) => {
    try {
      const result = await accountService.deleteAccount(password);
      leave("/uye-ol", result.message || "Aramızdan ayrılmana üzüldük");
    } catch (error) {
      toast.error(getErrorMessage(error, "Hesap silinemedi"));
    }
  };

  return {
    loading,
    profile,
    profileForm,
    setProfileForm,
    emailChanged,
    getProfile,
    handleUpdated,
    handleAvatarChange,
    changePassword,
    freezeProfile,
    deleteProfile,
    showFreezeModal,
    setShowFreezeModal,
    showDeleteModal,
    setShowDeleteModal,
    createOpen,
    createSetOpen,
    button,
    setButton,
  };
}
