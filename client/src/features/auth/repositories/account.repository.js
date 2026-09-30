import { accountApi } from "../api/account.api";

const unwrap = async (request) => (await request).data;

export const accountRepository = {
  getMe: () => unwrap(accountApi.getMe()),
  updateMe: (changes) => unwrap(accountApi.updateMe(changes)),
  changeEmail: (payload) => unwrap(accountApi.changeEmail(payload)),
  changePassword: (payload) => unwrap(accountApi.changePassword(payload)),
  updateAvatar: (formData) => unwrap(accountApi.updateAvatar(formData)),
  freeze: () => unwrap(accountApi.freeze()),
  deleteMe: (password) => unwrap(accountApi.deleteMe(password)),
  toggleFollow: (userId) => unwrap(accountApi.toggleFollow(userId)),
  sendFeedback: (payload) => unwrap(accountApi.sendFeedback(payload)),
};
