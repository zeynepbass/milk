import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const createLimiter = (limit, message, keyGenerator) =>
  rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.isTest,
    keyGenerator,
    message: { message, code: "TOO_MANY_REQUESTS" },
  });

export const authLimiter = createLimiter(20, "Çok fazla deneme yaptınız, lütfen daha sonra tekrar deneyin.");

export const loginLimiter = createLimiter(
  10,
  "Bu hesap için çok fazla giriş denemesi yapıldı, lütfen daha sonra tekrar deneyin.",
  (req) =>
    `${req.ip}:${String(req.body?.email ?? "")
      .trim()
      .toLowerCase()}`
);

export const refreshLimiter = createLimiter(
  120,
  "Çok fazla oturum yenileme isteği, lütfen daha sonra tekrar deneyin."
);
