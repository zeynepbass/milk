import * as userService from "../services/user.service.js";
import * as followService from "../services/follow.service.js";
import * as postService from "../services/post.service.js";
import { uploadedUrls } from "../middleware/upload.js";
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
  const [avatarUrl] = uploadedUrls(req);
  const user = await userService.updateAvatar(req.userId, avatarUrl);
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
  res.json({ message: "Hesabınız silindi" });
};

export const getProfile = async (req, res) => {
  res.json(await userService.getPublicProfile(req.params.id, req.userId));
};

export const getUserPosts = async (req, res) => {
  res.json(await postService.listUserPosts(req.params.id, req.userId, req.query));
};

export const follow = async (req, res) => {
  res.json(await followService.follow(req.userId, req.params.id));
};

export const unfollow = async (req, res) => {
  res.json(await followService.unfollow(req.userId, req.params.id));
};

export const getFollowers = async (req, res) => {
  res.json(await followService.listFollowers(req.params.id, req.query));
};

export const getFollowing = async (req, res) => {
  res.json(await followService.listFollowing(req.params.id, req.query));
};

export const getUsers = async (req, res) => {
  res.json(await userService.listUsers(req.query));
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
  res.json(await userService.listFeedbacks(req.query));
};
