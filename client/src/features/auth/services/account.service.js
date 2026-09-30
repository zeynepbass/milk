import { accountRepository } from "../repositories/account.repository";

const PROFILE_FIELDS = ["name", "surname", "province", "district"];

export const pickProfileChanges = (values, current) =>
  Object.fromEntries(
    PROFILE_FIELDS.filter((field) => (values[field] ?? "") !== (current?.[field] ?? "")).map((field) => [
      field,
      values[field] ?? "",
    ])
  );

export const accountService = {
  getMe: () => accountRepository.getMe(),

  async saveProfile(values, current) {
    let user = current;
    const changes = pickProfileChanges(values, current);

    if (Object.keys(changes).length > 0) {
      user = (await accountRepository.updateMe(changes)).user;
    }

    if (values.email && values.email !== current.email) {
      user = (await accountRepository.changeEmail({ email: values.email, currentPassword: values.currentPassword }))
        .user;
    }

    return user;
  },

  changePassword: (values) => accountRepository.changePassword(values),

  async updateAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return (await accountRepository.updateAvatar(formData)).user;
  },

  freeze: () => accountRepository.freeze(),

  deleteAccount: (password) => accountRepository.deleteMe(password),

  sendFeedback: (payload) => accountRepository.sendFeedback(payload),
};
