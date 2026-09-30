import { authenticateAccessToken } from "../services/auth.service.js";
import { forbidden, unauthorized } from "../utils/AppError.js";

const extractBearerToken = (header) => {
  if (typeof header !== "string" || !header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
};

export const authMiddleware = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(unauthorized("Oturum açmanız gerekiyor", "TOKEN_MISSING"));
  }

  const user = await authenticateAccessToken(token);

  req.user = user;
  req.userId = user.id;
  return next();
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(forbidden("Sadece admin erişebilir"));
  }
  return next();
};
