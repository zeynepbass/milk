import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { forbidden, notFound } from "../utils/AppError.js";
import { paginate } from "../utils/pagination.js";
import { enqueueJob } from "../jobs/queue.js";

const AUTHOR_FIELDS = "name surname avatar";

const commentNotFound = () => notFound("Yorum bulunamadı", "COMMENT_NOT_FOUND");

const viewerProjection = (viewerId) => ({
  post: 1,
  user: 1,
  text: 1,
  likesCount: 1,
  isEdited: 1,
  createdAt: 1,
  updatedAt: 1,
  likedByMe: viewerId
    ? { $in: [new mongoose.Types.ObjectId(viewerId.toString()), { $ifNull: ["$likes", []] }] }
    : { $literal: false },
});

const assertActivePost = async (postId) => {
  if (!(await Post.exists({ _id: postId, isActive: true }))) {
    throw notFound("Gönderi bulunamadı", "POST_NOT_FOUND");
  }
};

const getCommentView = async (commentId, viewerId) => {
  const comment = await Comment.findOne({ _id: commentId, isActive: true }, viewerProjection(viewerId))
    .populate("user", AUTHOR_FIELDS)
    .lean();

  if (!comment) throw commentNotFound();
  return comment;
};

export const listComments = async (postId, viewerId, { cursor, limit }) => {
  await assertActivePost(postId);

  return paginate(
    Comment,
    { post: new mongoose.Types.ObjectId(postId.toString()), isActive: true },
    {
      cursor,
      limit,
      projection: viewerProjection(viewerId),
      populate: { path: "user", select: AUTHOR_FIELDS },
    }
  );
};

export const addComment = async (userId, postId, text) => {
  await assertActivePost(postId);

  const comment = await Comment.create({ post: postId, user: userId, text });
  await enqueueJob("notify:activity", {
    type: "post_comment",
    actorId: userId,
    postId,
    commentId: comment._id,
  });

  return getCommentView(comment._id, userId);
};

const assertActiveComment = async (commentId) => {
  if (!(await Comment.exists({ _id: commentId, isActive: true }))) throw commentNotFound();
};

export const likeComment = async (userId, commentId) => {
  await assertActiveComment(commentId);
  await Comment.updateOne(
    { _id: commentId, likes: { $ne: userId } },
    { $addToSet: { likes: userId }, $inc: { likesCount: 1 } }
  );

  const view = await getCommentView(commentId, userId);
  return { commentId, liked: view.likedByMe, likesCount: view.likesCount };
};

export const unlikeComment = async (userId, commentId) => {
  await assertActiveComment(commentId);
  await Comment.updateOne(
    { _id: commentId, likes: userId },
    { $pull: { likes: userId }, $inc: { likesCount: -1 } }
  );

  const view = await getCommentView(commentId, userId);
  return { commentId, liked: view.likedByMe, likesCount: view.likesCount };
};

export const deleteComment = async (userId, commentId) => {
  const comment = await Comment.findOne({ _id: commentId, isActive: true });
  if (!comment) throw commentNotFound();

  if (comment.user.toString() !== userId.toString()) {
    throw forbidden("Bu yorumu silme yetkiniz yok");
  }

  comment.isActive = false;
  await comment.save();
};
