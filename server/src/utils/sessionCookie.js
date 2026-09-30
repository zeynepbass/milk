import { env } from "../config/env.js";

export const REFRESH_COOKIE_NAME = "milk_rt";

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/api/auth",
});

export const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, { ...cookieOptions(), maxAge: env.refreshTokenTtlMs });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions());
};

export const readRefreshCookie = (req) => req.cookies?.[REFRESH_COOKIE_NAME];

export const requestMeta = (req) => ({ ip: req.ip, userAgent: req.headers["user-agent"] });
