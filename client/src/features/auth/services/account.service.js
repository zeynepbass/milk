import { useAuthStore } from "@/shared/store/useAuthStore";
import { accountRepository } from "../repositories/account.repository";

const PROFILE_FIELDS = ["name", "surname", "province", "district"];

const pickProfileChanges = (form, current) =>
  Object.fromEntries(
    PROFILE_FIELDS.filter((field) => (form[field] ?? "") !== (current?.[field] ?? "")).map((field) => [
      field,
      form[field] ?? "",
    ])
  );

const syncSessionUser = (user) => {
  if (user) useAuthStore.getState().setUser(user);
  return user;
};

export const accountService = {
  getMe() {
    return accountRepository.getMe();
  },

  async saveProfile(form, current) {
    const changes = pickProfileChanges(form, current);
    if (Object.keys(changes).length === 0) return { user: current, changed: false };

    const { user } = await accountRepository.updateMe(changes);
    return { user: syncSessionUser(user), changed: true };
  },

  async changeEmail(email, currentPassword) {
    const { user } = await accountRepository.changeEmail({ email: email.trim(), currentPassword });
    return syncSessionUser(user);
  },

  async changePassword(currentPassword, newPassword) {
    const session = await accountRepository.changePassword({ currentPassword, newPassword });
    useAuthStore.getState().setSession(session);
    return session;
  },

  async updateAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    const { user } = await accountRepository.updateAvatar(formData);
    return syncSessionUser(user);
  },

  async freeze() {
    const result = await accountRepository.freeze();
    useAuthStore.getState().clearSession();
    return result;
  },

  async deleteAccount(password) {
    const result = await accountRepository.deleteMe(password);
    useAuthStore.getState().clearSession();
    return result;
  },

  toggleFollow(userId) {
    return accountRepository.toggleFollow(userId);
  },

  sendFeedback(payload) {
    return accountRepository.sendFeedback(payload);
  },
};
