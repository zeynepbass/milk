import { authenticateAccessToken } from "../services/auth.service.js";
import { forbidden, unauthorized } from "../utils/AppError.js";

const extractBearerToken = (header) => {
  if (typeof header !== "string" || !header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
};

const attachUser = (req, user) => {
  req.user = user;
  req.userId = user.id;
};

export const authMiddleware = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(unauthorized("Oturum açmanız gerekiyor", "TOKEN_MISSING"));
  }

  attachUser(req, await authenticateAccessToken(token));
  return next();
};

export const optionalAuth = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (token) {
    attachUser(req, await authenticateAccessToken(token));
  }

  return next();
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(forbidden("Sadece admin erişebilir"));
  }
  return next();
};
