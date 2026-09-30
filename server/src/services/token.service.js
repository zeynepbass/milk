import { createHash, randomBytes, randomUUID } from "node:crypto";
import RefreshToken from "../models/RefreshToken.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { unauthorized } from "../utils/AppError.js";

export const REFRESH_RACE_GRACE_MS = 10 * 1000;

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const invalidRefresh = () =>
  unauthorized("Oturumun süresi doldu, lütfen tekrar giriş yapın", "REFRESH_INVALID");

export const createRefreshToken = async ({ userId, familyId = randomUUID(), meta = {} }) => {
  const token = randomBytes(32).toString("base64url");

  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(token),
    familyId,
    expiresAt: new Date(Date.now() + env.refreshTokenTtlMs),
    ip: meta.ip,
    userAgent: meta.userAgent?.slice(0, 256),
  });

  return { token, familyId };
};

export const revokeFamily = (familyId) =>
  RefreshToken.updateMany({ familyId, revokedAt: null }, { $set: { revokedAt: new Date() } });

export const revokeAllForUser = (userId) =>
  RefreshToken.updateMany({ user: userId, revokedAt: null }, { $set: { revokedAt: new Date() } });

const handleReplacedToken = async (stored) => {
  const elapsed = Date.now() - stored.replacedAt.getTime();

  if (elapsed <= REFRESH_RACE_GRACE_MS) {
    throw unauthorized("Oturum başka bir sekmede yenilendi", "REFRESH_RACE");
  }

  await revokeFamily(stored.familyId);
  logger.warn(
    { userId: stored.user.toString(), familyId: stored.familyId },
    "Refresh token yeniden kullanımı tespit edildi"
  );
  throw invalidRefresh();
};

export const rotateRefreshToken = async (token, meta = {}) => {
  if (!token) throw invalidRefresh();

  const stored = await RefreshToken.findOne({ tokenHash: hashToken(token) });

  if (!stored || stored.revokedAt || stored.expiresAt.getTime() <= Date.now()) {
    throw invalidRefresh();
  }

  if (stored.replacedAt) {
    await handleReplacedToken(stored);
  }

  const claimed = await RefreshToken.findOneAndUpdate(
    { _id: stored._id, replacedAt: null, revokedAt: null },
    { $set: { replacedAt: new Date() } }
  );

  if (!claimed) {
    throw unauthorized("Oturum başka bir sekmede yenilendi", "REFRESH_RACE");
  }

  const next = await createRefreshToken({ userId: stored.user, familyId: stored.familyId, meta });

  return { userId: stored.user.toString(), ...next };
};

export const revokeByToken = async (token) => {
  if (!token) return;

  const stored = await RefreshToken.findOne({ tokenHash: hashToken(token) }).lean();
  if (stored) await revokeFamily(stored.familyId);
};
