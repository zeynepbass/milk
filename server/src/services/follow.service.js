import Follow from "../models/Follow.js";
import User from "../models/User.js";
import { badRequest, notFound } from "../utils/AppError.js";
import { paginate } from "../utils/pagination.js";
import { withTransaction } from "../utils/transaction.js";
import { enqueueJob } from "../jobs/queue.js";

export const PUBLIC_USER_FIELDS = "name surname avatar role dogrulanmisSatici";

const assertFollowable = async (followerId, targetId) => {
  if (followerId.toString() === targetId.toString()) {
    throw badRequest("Kendini takip edemezsin", "SELF_FOLLOW");
  }

  if (!(await User.exists({ _id: targetId, deletedAt: null }))) {
    throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");
  }
};

const adjustCounts = async (followerId, targetId, delta, session) => {
  await User.updateOne({ _id: followerId }, { $inc: { followingCount: delta } }, { session });
  await User.updateOne({ _id: targetId }, { $inc: { followersCount: delta } }, { session });
};

export const follow = async (followerId, targetId) => {
  await assertFollowable(followerId, targetId);

  try {
    await withTransaction(async (session) => {
      await Follow.create([{ follower: followerId, following: targetId }], { session });
      await adjustCounts(followerId, targetId, 1, session);
    });
  } catch (err) {
    if (err?.code === 11000) return { following: true };
    throw err;
  }

  await enqueueJob("notify:activity", { type: "follow", actorId: followerId, targetUserId: targetId });
  return { following: true };
};

export const unfollow = async (followerId, targetId) => {
  await withTransaction(async (session) => {
    const result = await Follow.deleteOne({ follower: followerId, following: targetId }, { session });
    if (result.deletedCount > 0) {
      await adjustCounts(followerId, targetId, -1, session);
    }
  });

  return { following: false };
};

export const isFollowing = async (followerId, targetId) =>
  Boolean(await Follow.exists({ follower: followerId, following: targetId }));

export const followedAmong = async (followerId, candidateIds) => {
  if (!followerId || candidateIds.length === 0) return new Set();

  const follows = await Follow.find({ follower: followerId, following: { $in: candidateIds } })
    .select("following")
    .lean();

  return new Set(follows.map((item) => item.following.toString()));
};

export const followingIds = async (followerId) =>
  (await Follow.find({ follower: followerId }).select("following").lean()).map((item) => item.following);

export const followerIds = async (userId) =>
  (await Follow.find({ following: userId }).select("follower").lean()).map((item) => item.follower);

const listRelations = async (filter, relationField, { cursor, limit }) => {
  const page = await paginate(Follow, filter, {
    cursor,
    limit,
    populate: { path: relationField, select: PUBLIC_USER_FIELDS },
  });

  return {
    items: page.items.map((item) => item[relationField]).filter(Boolean),
    nextCursor: page.nextCursor,
  };
};

export const listFollowers = (userId, pagination) =>
  listRelations({ following: userId }, "follower", pagination);

export const listFollowing = (userId, pagination) =>
  listRelations({ follower: userId }, "following", pagination);

export const removeAllFollowsOf = async (userId, session) => {
  const relations = await Follow.find({ $or: [{ follower: userId }, { following: userId }] }, null, {
    session,
  }).lean();

  const followedByUser = relations
    .filter((item) => item.follower.toString() === userId.toString())
    .map((item) => item.following);
  const followersOfUser = relations
    .filter((item) => item.following.toString() === userId.toString())
    .map((item) => item.follower);

  await User.updateMany({ _id: { $in: followedByUser } }, { $inc: { followersCount: -1 } }, { session });
  await User.updateMany({ _id: { $in: followersOfUser } }, { $inc: { followingCount: -1 } }, { session });
  await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] }, { session });
};
