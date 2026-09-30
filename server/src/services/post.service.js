import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { forbidden, notFound } from "../utils/AppError.js";
import { removeUploadedFile, toUploadUrl } from "../utils/uploads.js";
import { notifyProvinceAboutPost } from "./notification.service.js";

const LIST_FIELDS = "title district category createdAt user images ownerName ownerSurname ownerRole likes savedBy";
const OWNER_FIELDS = "name surname avatar dogrulanmisSatici";

const postNotFound = () => notFound("Gönderi bulunamadı", "POST_NOT_FOUND");

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

const findPosts = (filter, limit) =>
  Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select(LIST_FIELDS)
    .populate({ path: "user", select: OWNER_FIELDS })
    .lean();

export const listPosts = ({ district, category, title, limit }) => {
  const filter = { isActive: true };

  if (district) filter.district = district;
  if (category) filter.category = category;
  if (title) filter.$text = { $search: title };

  return findPosts(filter, limit);
};

export const listFollowingPosts = async (userId, limit) => {
  const user = await User.findById(userId).select("following").lean();
  if (!user?.following?.length) return [];

  return findPosts({ user: { $in: user.following }, isActive: true }, limit);
};

export const listSavedPosts = (userId, limit) => findPosts({ savedBy: userId, isActive: true }, limit);

export const listMyPosts = (userId, limit) => findPosts({ user: userId, isActive: true }, limit);

export const getPostWithComments = async (postId) => {
  const post = await Post.findOne({ _id: postId, isActive: true }).populate("user", "name surname avatar").lean();
  if (!post) throw postNotFound();

  const comments = await Comment.find({ post: post._id, isActive: true })
    .populate("user", "name surname avatar")
    .sort({ createdAt: -1 })
    .lean();

  return { post, comments };
};

export const createPost = async (userId, data, files = []) => {
  const author = await User.findById(userId).lean();
  if (!author) throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");

  if (author.role === "alici") {
    await Promise.all(files.map((file) => removeUploadedFile(toUploadUrl(file.filename))));
    throw forbidden("Alıcı rolündeki kullanıcı ilan paylaşamaz", "ROLE_NOT_ALLOWED");
  }

  const post = await Post.create({
    ...data,
    user: author._id,
    ownerName: author.name,
    ownerSurname: author.surname,
    ownerRole: author.role === "admin" ? "satici" : author.role,
    image: author.avatar,
    images: files.map((file) => toUploadUrl(file.filename)),
  });

  await notifyProvinceAboutPost(post, author);

  return post.toObject();
};

export const updatePost = async (userId, postId, changes, files = []) => {
  const post = await findActivePost(postId);
  assertOwner(post, userId);

  Object.assign(post, changes);

  if (files.length > 0) {
    post.images = [...(post.images ?? []), ...files.map((file) => toUploadUrl(file.filename))];
  }

  await post.save();
  return post.toObject();
};

export const deletePost = async (userId, postId) => {
  const post = await findActivePost(postId);
  assertOwner(post, userId);

  post.isActive = false;
  await post.save();
};

const toggleMembership = async (postId, field, userId) => {
  const post = await Post.findOne({ _id: postId, isActive: true }).select(`_id ${field}`).lean();
  if (!post) throw postNotFound();

  const isMember = post[field].some((id) => id.toString() === userId.toString());
  const operator = isMember ? "$pull" : "$addToSet";

  const updated = await Post.findOneAndUpdate(
    { _id: postId },
    { [operator]: { [field]: userId } },
    { returnDocument: "after", projection: { [field]: 1 } }
  ).lean();

  return { active: !isMember, members: updated[field] };
};

export const toggleLike = async (userId, postId) => {
  const { active, members } = await toggleMembership(postId, "likes", userId);
  return { postId, likes: members, likesCount: members.length, liked: active };
};

export const toggleSave = async (userId, postId) => {
  const { active, members } = await toggleMembership(postId, "savedBy", userId);
  return { saved: active, savedCount: members.length };
};
