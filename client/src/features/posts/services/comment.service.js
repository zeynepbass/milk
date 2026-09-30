import { commentRepository } from "../repositories/comment.repository";

export const commentService = {
  getComments: (postId, { cursor } = {}) =>
    commentRepository.getComments(postId, cursor ? { cursor } : undefined),

  addComment(postId, text) {
    const trimmed = text?.trim();
    if (!trimmed) throw new Error("Yorum boş bırakılamaz.");
    return commentRepository.addComment(postId, trimmed);
  },

  setLike: (commentId, liked) => commentRepository.setLike(commentId, liked),

  deleteComment: (commentId) => commentRepository.deleteComment(commentId),
};
