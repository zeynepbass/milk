import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { forbidden, notFound } from "../utils/AppError.js";

const LIKER_FIELDS = "name surname avatar";

const commentNotFound = () => notFound("Yorum bulunamadı", "COMMENT_NOT_FOUND");

export const listComments = (postId) =>
  Comment.find({ post: postId, isActive: true })
    .populate("user", "name surname avatar")
    .sort({ createdAt: -1 })
    .lean();

export const addComment = async (userId, postId, text) => {
  if (!(await Post.exists({ _id: postId, isActive: true }))) {
    throw notFound("Gönderi bulunamadı", "POST_NOT_FOUND");
  }

  const comment = await Comment.create({ post: postId, user: userId, text });
  return Comment.findById(comment._id).populate("user", "name surname avatar").lean();
};

export const toggleLike = async (userId, commentId) => {
  const comment = await Comment.findOne({ _id: commentId, isActive: true }).select("likes").lean();
  if (!comment) throw commentNotFound();

  const liked = comment.likes.some((id) => id.toString() === userId.toString());

  const updated = await Comment.findOneAndUpdate(
    { _id: commentId },
    { [liked ? "$pull" : "$addToSet"]: { likes: userId } },
    { returnDocument: "after" }
  )
    .populate("likes", LIKER_FIELDS)
    .lean();

  return { likesCount: updated.likes.length, liked: !liked, likes: updated.likes };
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
