import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { badRequest, forbidden, notFound } from "../utils/AppError.js";
import { paginate } from "../utils/pagination.js";
import { removeStoredFiles } from "../storage/index.js";
import { enqueueJob } from "../jobs/queue.js";
import { RULES } from "../validators/rules.js";
import { followedAmong, followingIds, PUBLIC_USER_FIELDS } from "./follow.service.js";

const postNotFound = () => notFound("Gönderi bulunamadı", "POST_NOT_FOUND");

const toObjectId = (id) => (id ? new mongoose.Types.ObjectId(id.toString()) : null);

const viewerProjection = (viewerId) => {
  const viewer = toObjectId(viewerId);

  return {
    title: 1,
    description: 1,
    images: 1,
    province: 1,
    district: 1,
    category: 1,
    user: 1,
    likesCount: 1,
    savesCount: 1,
    createdAt: 1,
    updatedAt: 1,
    likedByMe: viewer ? { $in: [viewer, { $ifNull: ["$likes", []] }] } : { $literal: false },
    savedByMe: viewer ? { $in: [viewer, { $ifNull: ["$savedBy", []] }] } : { $literal: false },
  };
};

const withAuthorFollowState = async (posts, viewerId) => {
  const authorIds = [...new Set(posts.map((post) => post.user?._id?.toString()).filter(Boolean))];
  const followed = await followedAmong(viewerId, authorIds);

  return posts.map((post) => ({
    ...post,
    isFollowingAuthor: followed.has(post.user?._id?.toString()),
  }));
};

const findPostPage = async (filter, { viewerId, cursor, limit }) => {
  const page = await paginate(Post, filter, {
    cursor,
    limit,
    projection: viewerProjection(viewerId),
    populate: { path: "user", select: PUBLIC_USER_FIELDS },
  });

  return { items: await withAuthorFollowState(page.items, viewerId), nextCursor: page.nextCursor };
};

const findActivePost = async (postId) => {
  const post = await Post.findOne({ _id: postId, isActive: true });
  if (!post) throw postNotFound();
  return post;
};

const assertOwner = (post, userId) => {
  if (post.user.toString() !== userId.toString()) {
    throw forbidden("Bu gönderi üzerinde işlem yapma yetkiniz yok");
  }
};

export const getPostView = async (postId, viewerId) => {
  const post = await Post.findOne({ _id: postId, isActive: true }, viewerProjection(viewerId))
    .populate({ path: "user", select: PUBLIC_USER_FIELDS })
    .lean();

  if (!post) throw postNotFound();

  const [view] = await withAuthorFollowState([post], viewerId);
  return view;
};

export const listPosts = ({ viewerId, district, category, title, cursor, limit }) => {
  const filter = { isActive: true };

  if (district) filter.district = district;
  if (category) filter.category = category;
  if (title) filter.$text = { $search: title };

  return findPostPage(filter, { viewerId, cursor, limit });
};

export const listFollowingPosts = async (viewerId, pagination) => {
  const authors = await followingIds(viewerId);
  if (authors.length === 0) return { items: [], nextCursor: null };

  return findPostPage({ user: { $in: authors }, isActive: true }, { viewerId, ...pagination });
};

export const listSavedPosts = (viewerId, pagination) =>
  findPostPage({ savedBy: toObjectId(viewerId), isActive: true }, { viewerId, ...pagination });

export const listUserPosts = (authorId, viewerId, pagination) =>
  findPostPage({ user: toObjectId(authorId), isActive: true }, { viewerId, ...pagination });

export const createPost = async (userId, data, imageUrls = []) => {
  const author = await User.findOne({ _id: userId, deletedAt: null }).lean();

  if (!author || author.role === "alici") {
    await removeStoredFiles(imageUrls);
    if (!author) throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");
    throw forbidden("Alıcı rolündeki kullanıcı ilan paylaşamaz", "ROLE_NOT_ALLOWED");
  }

  const post = await Post.create({ ...data, user: author._id, images: imageUrls });
  await enqueueJob("notify:new-post", { postId: post._id });

  return getPostView(post._id, userId);
};

export const updatePost = async (userId, postId, { removeImages = [], ...changes }, newImageUrls = []) => {
  const post = await findActivePost(postId).catch(async (err) => {
    await removeStoredFiles(newImageUrls);
    throw err;
  });

  try {
    assertOwner(post, userId);

    const unknown = removeImages.filter((url) => !post.images.includes(url));
    if (unknown.length > 0) {
      throw badRequest("Kaldırılmak istenen görsel bu gönderiye ait değil", "IMAGE_NOT_IN_POST");
    }

    const remaining = post.images.filter((url) => !removeImages.includes(url));
    if (remaining.length + newImageUrls.length > RULES.postImages.max) {
      throw badRequest(`Bir gönderide en fazla ${RULES.postImages.max} görsel olabilir`, "TOO_MANY_IMAGES");
    }

    Object.assign(post, changes, { images: [...remaining, ...newImageUrls] });
    await post.save();
  } catch (err) {
    await removeStoredFiles(newImageUrls);
    throw err;
  }

  await removeStoredFiles(removeImages);
  return getPostView(post._id, userId);
};

export const deletePost = async (userId, postId) => {
  const post = await findActivePost(postId);
  assertOwner(post, userId);

  post.isActive = false;
  await post.save();
};

const reactionState = async (postId, viewerId) => {
  const post = await Post.findOne({ _id: postId }, viewerProjection(viewerId)).lean();
  return post;
};

export const likePost = async (userId, postId) => {
  await findActivePost(postId);

  const result = await Post.updateOne(
    { _id: postId, isActive: true, likes: { $ne: userId } },
    { $addToSet: { likes: userId }, $inc: { likesCount: 1 } }
  );

  if (result.modifiedCount > 0) {
    await enqueueJob("notify:activity", { type: "post_like", actorId: userId, postId });
  }

  const state = await reactionState(postId, userId);
  return { postId, liked: state.likedByMe, likesCount: state.likesCount };
};

export const unlikePost = async (userId, postId) => {
  await findActivePost(postId);
  await Post.updateOne(
    { _id: postId, likes: userId },
    { $pull: { likes: userId }, $inc: { likesCount: -1 } }
  );

  const state = await reactionState(postId, userId);
  return { postId, liked: state.likedByMe, likesCount: state.likesCount };
};

export const savePost = async (userId, postId) => {
  await findActivePost(postId);
  await Post.updateOne(
    { _id: postId, isActive: true, savedBy: { $ne: userId } },
    { $addToSet: { savedBy: userId }, $inc: { savesCount: 1 } }
  );

  const state = await reactionState(postId, userId);
  return { postId, saved: state.savedByMe, savesCount: state.savesCount };
};

export const unsavePost = async (userId, postId) => {
  await findActivePost(postId);
  await Post.updateOne(
    { _id: postId, savedBy: userId },
    { $pull: { savedBy: userId }, $inc: { savesCount: -1 } }
  );

  const state = await reactionState(postId, userId);
  return { postId, saved: state.savedByMe, savesCount: state.savesCount };
};
