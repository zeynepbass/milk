import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { generateAccessToken, verifyAccessToken } from "../config/jwt.js";
import { conflict, unauthorized } from "../utils/AppError.js";
import { createRefreshToken, revokeByToken, revokeFamily, rotateRefreshToken } from "./token.service.js";

export const BCRYPT_ROUNDS = env.isTest ? 4 : 12;

const INVALID_CREDENTIALS_MESSAGE = "E-posta veya şifre hatalı";

const dummyHashPromise = bcrypt.hash("milk-timing-equalizer", BCRYPT_ROUNDS);
const getDummyHash = () => dummyHashPromise;

export const hashPassword = (plain) => bcrypt.hash(plain, BCRYPT_ROUNDS);

export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash ?? "");

export const toSessionUser = (user) => ({
  _id: user._id,
  name: user.name,
  surname: user.surname,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  province: user.province,
  district: user.district,
  organic: user.organic,
  organicStatus: user.organicStatus,
  dogrulanmisSatici: user.dogrulanmisSatici,
  followersCount: user.followersCount ?? 0,
  followingCount: user.followingCount ?? 0,
});

export const issueSession = async (user, meta, familyId) => {
  const [accessToken, refresh] = await Promise.all([
    generateAccessToken(user._id),
    createRefreshToken({ userId: user._id, familyId, meta }),
  ]);

  return { user: toSessionUser(user), accessToken, refreshToken: refresh.token };
};

export const register = async ({ name, surname, email, password, role }) => {
  if (await User.exists({ email })) {
    throw conflict("Bu e-posta adresi zaten kayıtlı", "EMAIL_TAKEN");
  }

  try {
    const user = await User.create({
      name,
      surname,
      email,
      role,
      password: await hashPassword(password),
    });

    return toSessionUser(user);
  } catch (err) {
    if (err?.code === 11000) {
      throw conflict("Bu e-posta adresi zaten kayıtlı", "EMAIL_TAKEN");
    }
    throw err;
  }
};

export const login = async ({ email, password }, meta) => {
  const user = await User.findOne({ email, deletedAt: null }).select("+password");

  if (!user) {
    await verifyPassword(password, await getDummyHash());
    throw unauthorized(INVALID_CREDENTIALS_MESSAGE, "INVALID_CREDENTIALS");
  }

  if (!(await verifyPassword(password, user.password))) {
    throw unauthorized(INVALID_CREDENTIALS_MESSAGE, "INVALID_CREDENTIALS");
  }

  if (user.status === false) {
    user.status = true;
    await user.save();
  }

  return issueSession(user, meta);
};

export const refreshSession = async (token, meta) => {
  const rotated = await rotateRefreshToken(token, meta);
  const user = await User.findById(rotated.userId);

  if (!user || user.status === false || user.deletedAt) {
    await revokeFamily(rotated.familyId);
    throw unauthorized("Oturum geçersiz", "REFRESH_INVALID");
  }

  const accessToken = await generateAccessToken(user._id);

  return { user: toSessionUser(user), accessToken, refreshToken: rotated.token };
};

export const logout = (token) => revokeByToken(token);

const readAccessToken = async (token) => {
  try {
    return await verifyAccessToken(token);
  } catch (err) {
    if (err?.code === "ERR_JWT_EXPIRED") {
      throw unauthorized("Oturum süresi doldu", "TOKEN_EXPIRED");
    }
    throw unauthorized("Geçersiz oturum", "TOKEN_INVALID");
  }
};

export const authenticateAccessToken = async (token) => {
  const payload = await readAccessToken(token);

  if (!payload.sub || !/^[a-f\d]{24}$/i.test(payload.sub)) {
    throw unauthorized("Geçersiz oturum", "TOKEN_INVALID");
  }

  const user = await User.findById(payload.sub).select("+passwordChangedAt role status deletedAt").lean();

  if (!user || user.deletedAt) {
    throw unauthorized("Geçersiz oturum", "TOKEN_INVALID");
  }

  if (user.status === false) {
    throw unauthorized("Hesap dondurulmuş", "ACCOUNT_FROZEN");
  }

  if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
    throw unauthorized("Oturum geçersiz, lütfen tekrar giriş yapın", "TOKEN_STALE");
  }

  return { id: user._id.toString(), role: user.role, exp: payload.exp };
};
