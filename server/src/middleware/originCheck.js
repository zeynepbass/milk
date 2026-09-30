import { env } from "../config/env.js";
import { forbidden } from "../utils/AppError.js";

export const isAllowedOrigin = (origin) => env.clientUrls.includes(origin);

export const requireAllowedOrigin = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin && !isAllowedOrigin(origin)) {
    return next(forbidden("İzin verilmeyen kaynak", "ORIGIN_NOT_ALLOWED"));
  }

  return next();
};
