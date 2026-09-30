import * as userService from "../services/user.service.js";
import { getLimit } from "../utils/pagination.js";
import { clearRefreshCookie, requestMeta, setRefreshCookie } from "../utils/sessionCookie.js";

export const getMe = async (req, res) => {
  res.json(await userService.getMe(req.userId));
};

export const updateMe = async (req, res) => {
  const user = await userService.updateMe(req.userId, req.body);
  res.json({ message: "Güncellendi", user });
};

export const changePassword = async (req, res) => {
  const session = await userService.changePassword(req.userId, req.body, requestMeta(req));
  setRefreshCookie(res, session.refreshToken);
  res.json({ message: "Şifreniz güncellendi", accessToken: session.accessToken, user: session.user });
};

export const changeEmail = async (req, res) => {
  const user = await userService.changeEmail(req.userId, req.body);
  res.json({ message: "E-posta adresiniz güncellendi", user });
};

export const updateAvatar = async (req, res) => {
  const user = await userService.updateAvatar(req.userId, req.file);
  res.json({ message: "Profil fotoğrafı güncellendi", user });
};

export const freezeMe = async (req, res) => {
  await userService.freezeMe(req.userId);
  clearRefreshCookie(res);
  res.json({ message: "Hesap donduruldu" });
};

export const deleteMe = async (req, res) => {
  await userService.deleteMe(req.userId, req.body);
  clearRefreshCookie(res);
  res.json({ message: "Kullanıcı başarıyla silindi" });
};

export const followUser = async (req, res) => {
  const { following } = await userService.toggleFollow(req.userId, req.params.id);
  res.json({ following, message: following ? "Takip edildi" : "Takipten çıkıldı" });
};

export const getUsers = async (req, res) => {
  res.json(await userService.listUsers(getLimit(req)));
};

export const updateOrganicStatus = async (req, res) => {
  const user = await userService.setOrganicStatus(req.body);
  res.json({ message: "Güncellendi", user });
};

export const changeRole = async (req, res) => {
  const user = await userService.changeRole(req.params.id, req.body.role);
  res.json({ message: "Rol güncellendi", user });
};

export const createFeedback = async (req, res) => {
  const feedback = await userService.createFeedback(req.userId, req.body);
  res.status(201).json({ message: "Geri bildiriminiz başarıyla gönderildi.", feedback });
};

export const getFeedbacks = async (req, res) => {
  res.json(await userService.listFeedbacks());
};
