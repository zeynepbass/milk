import * as authService from "../services/auth.service.js";
import {
  clearRefreshCookie,
  readRefreshCookie,
  requestMeta,
  setRefreshCookie,
} from "../utils/sessionCookie.js";

const sendSession = (res, session, message) => {
  setRefreshCookie(res, session.refreshToken);
  res.status(200).json({ message, accessToken: session.accessToken, user: session.user });
};

export const register = async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({ message: "Kayıt başarılı", user });
};

export const login = async (req, res) => {
  const session = await authService.login(req.body, requestMeta(req));
  sendSession(res, session, "Giriş başarılı");
};

export const refresh = async (req, res) => {
  try {
    const session = await authService.refreshSession(readRefreshCookie(req), requestMeta(req));
    sendSession(res, session, "Oturum yenilendi");
  } catch (err) {
    if (err.code !== "REFRESH_RACE") clearRefreshCookie(res);
    throw err;
  }
};

export const logout = async (req, res) => {
  await authService.logout(readRefreshCookie(req));
  clearRefreshCookie(res);
  res.status(204).end();
};
