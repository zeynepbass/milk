import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import { badRequest, conflict, notFound, unauthorized } from "../utils/AppError.js";
import { removeUploadedFile, toUploadUrl } from "../utils/uploads.js";
import { disconnectUser } from "../sockets/emitter.js";
import { hashPassword, issueSession, verifyPassword } from "./auth.service.js";
import { revokeAllForUser } from "./token.service.js";

const findUserOrThrow = async (userId, projection) => {
  const query = User.findById(userId);
  if (projection) query.select(projection);

  const user = await query;
  if (!user) throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");
  return user;
};

const assertPassword = async (user, plain) => {
  if (!(await verifyPassword(plain, user.password))) {
    throw unauthorized("Mevcut şifre hatalı", "INVALID_PASSWORD");
  }
};

const endAllSessions = async (userId) => {
  await revokeAllForUser(userId);
  disconnectUser(userId);
};

export const getMe = (userId) =>
  User.findById(userId).populate("followers following", "name surname avatar").lean();

export const updateMe = async (userId, changes) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: changes },
    { returnDocument: "after", runValidators: true }
  );

  if (!user) throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");
  return user.toJSON();
};

export const changePassword = async (userId, { currentPassword, newPassword }, meta) => {
  const user = await findUserOrThrow(userId, "+password");
  await assertPassword(user, currentPassword);

  user.password = await hashPassword(newPassword);
  user.passwordChangedAt = new Date(Date.now() - 1000);
  await user.save();

  await endAllSessions(user._id);
  return issueSession(user, meta);
};

export const changeEmail = async (userId, { email, currentPassword }) => {
  const user = await findUserOrThrow(userId, "+password");
  await assertPassword(user, currentPassword);

  if (user.email === email) return user.toJSON();

  if (await User.exists({ email, _id: { $ne: user._id } })) {
    throw conflict("Bu e-posta adresi başka bir hesapta kullanılıyor", "EMAIL_TAKEN");
  }

  user.email = email;

  try {
    await user.save();
  } catch (err) {
    if (err?.code === 11000) {
      throw conflict("Bu e-posta adresi başka bir hesapta kullanılıyor", "EMAIL_TAKEN");
    }
    throw err;
  }

  return user.toJSON();
};

export const updateAvatar = async (userId, file) => {
  if (!file) throw badRequest("Görsel seçilmedi", "FILE_REQUIRED");

  const user = await findUserOrThrow(userId);
  const previousAvatar = user.avatar;

  user.avatar = toUploadUrl(file.filename);
  await user.save();
  await removeUploadedFile(previousAvatar);

  return user.toJSON();
};

export const freezeMe = async (userId) => {
  const result = await User.updateOne({ _id: userId }, { $set: { status: false } });
  if (result.matchedCount === 0) throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");

  await endAllSessions(userId);
};

export const deleteMe = async (userId, { password }) => {
  const user = await findUserOrThrow(userId, "+password");
  await assertPassword(user, password);

  await User.deleteOne({ _id: user._id });
  await endAllSessions(user._id);
  await removeUploadedFile(user.avatar);
};

export const toggleFollow = async (userId, targetId) => {
  if (userId.toString() === targetId.toString()) {
    throw badRequest("Kendini takip edemezsin", "SELF_FOLLOW");
  }

  if (!(await User.exists({ _id: targetId }))) {
    throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");
  }

  const isFollowing = Boolean(await User.exists({ _id: userId, following: targetId }));
  const operator = isFollowing ? "$pull" : "$addToSet";

  await Promise.all([
    User.updateOne({ _id: userId }, { [operator]: { following: targetId } }),
    User.updateOne({ _id: targetId }, { [operator]: { followers: userId } }),
  ]);

  return { following: !isFollowing };
};

export const listUsers = (limit) => User.find().limit(limit).lean();

export const setOrganicStatus = async ({ userId, organicStatus }) => {
  const changes = organicStatus ? { organicStatus, dogrulanmisSatici: true } : { organicStatus };
  return updateMe(userId, changes);
};

export const changeRole = async (userId, role) => {
  const user = await updateMe(userId, { role });
  await endAllSessions(userId);
  return user;
};

export const createFeedback = (userId, { type, message }) => Feedback.create({ user: userId, type, message });

export const listFeedbacks = () =>
  Feedback.find().populate("user", "name email role").sort({ createdAt: -1 }).lean();
