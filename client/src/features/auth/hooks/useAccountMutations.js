import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { clearLocalSession, startSession } from "@/shared/api/session";
import { queryKeys } from "@/shared/query/queryKeys";
import { useThemeStore } from "@/shared/store/useThemeStore";
import { accountService } from "../services/account.service";

const useSetMe = () => {
  const queryClient = useQueryClient();
  return (user) => {
    queryClient.setQueryData(queryKeys.me, (current) => ({ ...current, ...user }));
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
  };
};

export function useSaveProfile() {
  const setMe = useSetMe();

  return useMutation({
    mutationFn: ({ values, current }) => accountService.saveProfile(values, current),
    onSuccess: (user) => {
      setMe(user);
      toast.info("Profil güncellendi");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Profil güncellenemedi")),
  });
}

export function useUpdateAvatar() {
  const setMe = useSetMe();

  return useMutation({
    mutationFn: (file) => accountService.updateAvatar(file),
    onSuccess: (user) => {
      setMe(user);
      toast.info("Profil fotoğrafı güncellendi");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Profil fotoğrafı yüklenemedi")),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (values) => accountService.changePassword(values),
    onSuccess: (session) => {
      startSession(session);
      toast.info("Şifreniz güncellendi");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Şifre güncellenemedi")),
  });
}

const useLeaveAccount = (mutationFn, { path, fallbackMessage, errorMessage }) => {
  const navigate = useNavigate();
  const setTheme = useThemeStore((state) => state.setTheme);

  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      clearLocalSession();
      setTheme("light");
      navigate(path, { replace: true });
      toast.info(result.message || fallbackMessage);
    },
    onError: (error) => toast.error(getErrorMessage(error, errorMessage)),
  });
};

export const useFreezeAccount = () =>
  useLeaveAccount(() => accountService.freeze(), {
    path: "/giris-yap",
    fallbackMessage: "Tekrardan görüşmek üzere",
    errorMessage: "Hesap dondurulamadı",
  });

export const useDeleteAccount = () =>
  useLeaveAccount((password) => accountService.deleteAccount(password), {
    path: "/uye-ol",
    fallbackMessage: "Aramızdan ayrılmana üzüldük",
    errorMessage: "Hesap silinemedi",
  });

export function useSendFeedback() {
  return useMutation({
    mutationFn: (payload) => accountService.sendFeedback(payload),
    onSuccess: (result) => toast.info(result.message || "Geri bildiriminiz alındı"),
    onError: (error) => toast.error(getErrorMessage(error, "Geri bildirim gönderilemedi.")),
  });
}
