import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Feedback from "../models/Feedback.js";
import RefreshToken from "../models/RefreshToken.js";
import { badRequest, conflict, notFound, unauthorized } from "../utils/AppError.js";
import { paginate } from "../utils/pagination.js";
import { withTransaction } from "../utils/transaction.js";
import { removeStoredFiles } from "../storage/index.js";
import { disconnectUser } from "../sockets/emitter.js";
import { hashPassword, issueSession, toSessionUser, verifyPassword } from "./auth.service.js";
import { revokeAllForUser } from "./token.service.js";
import { isFollowing, removeAllFollowsOf } from "./follow.service.js";
import { hideConversationsOf } from "./message.service.js";
import { removeNotificationsOf } from "./notification.service.js";

const userNotFound = () => notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");

const findUserOrThrow = async (userId, projection) => {
  const query = User.findOne({ _id: userId, deletedAt: null });
  if (projection) query.select(projection);

  const user = await query;
  if (!user) throw userNotFound();
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

export const getMe = async (userId) => toSessionUser(await findUserOrThrow(userId));

export const getPublicProfile = async (userId, viewerId) => {
  const user = await User.findOne({ _id: userId, deletedAt: null })
    .select("name surname avatar role province district dogrulanmisSatici followersCount followingCount createdAt")
    .lean();

  if (!user) throw userNotFound();

  const following = viewerId && viewerId.toString() !== userId.toString() ? await isFollowing(viewerId, userId) : false;
  return { ...user, isFollowing: following };
};

export const updateMe = async (userId, changes) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, deletedAt: null },
    { $set: changes },
    { returnDocument: "after", runValidators: true }
  );

  if (!user) throw userNotFound();
  return toSessionUser(user);
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

  if (user.email === email) return toSessionUser(user);

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

  return toSessionUser(user);
};

export const updateAvatar = async (userId, avatarUrl) => {
  if (!avatarUrl) throw badRequest("Görsel seçilmedi", "FILE_REQUIRED");

  const user = await findUserOrThrow(userId).catch(async (err) => {
    await removeStoredFiles([avatarUrl]);
    throw err;
  });

  const previousAvatar = user.avatar;
  user.avatar = avatarUrl;
  await user.save();
  await removeStoredFiles([previousAvatar]);

  return toSessionUser(user);
};

export const freezeMe = async (userId) => {
  const result = await User.updateOne({ _id: userId, deletedAt: null }, { $set: { status: false } });
  if (result.matchedCount === 0) throw userNotFound();

  await endAllSessions(userId);
};

const collectOwnedFiles = async (user) => {
  const posts = await Post.find({ user: user._id }).select("images").lean();
  return [user.avatar, ...posts.flatMap((post) => post.images ?? [])];
};

export const deleteMe = async (userId, { password }) => {
  const user = await findUserOrThrow(userId, "+password");
  await assertPassword(user, password);

  const files = await collectOwnedFiles(user);
  const now = new Date();

  await withTransaction(async (session) => {
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          deletedAt: now,
          status: false,
          email: `silinmis-${user._id}@milk.invalid`,
          name: "Silinmiş",
          surname: "Kullanıcı",
          followersCount: 0,
          followingCount: 0,
        },
        $unset: { password: "", avatar: "", province: "", district: "", organic: "" },
      },
      { session }
    );
    await Post.updateMany({ user: user._id }, { $set: { isActive: false, images: [] } }, { session });
    await Comment.updateMany({ user: user._id }, { $set: { isActive: false } }, { session });
    await hideConversationsOf(user._id, session);
    await removeAllFollowsOf(user._id, session);
    await removeNotificationsOf(user._id, session);
    await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { $set: { revokedAt: now } }, { session });
  });

  disconnectUser(user._id);
  await removeStoredFiles(files);
};

export const listUsers = (pagination) => paginate(User, { deletedAt: null }, pagination);

export const setOrganicStatus = ({ userId, organicStatus }) =>
  updateMe(userId, organicStatus ? { organicStatus, dogrulanmisSatici: true } : { organicStatus });

export const changeRole = async (userId, role) => {
  const user = await updateMe(userId, { role });
  await endAllSessions(userId);
  return user;
};

export const touchLastSeen = (userId) => User.updateOne({ _id: userId }, { $set: { lastSeen: new Date() } });

export const createFeedback = (userId, { type, message }) => Feedback.create({ user: userId, type, message });

export const listFeedbacks = (pagination) =>
  paginate(Feedback, {}, { ...pagination, populate: { path: "user", select: "name email role" } });
