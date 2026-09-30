import { commentRepository } from "../repositories/comment.repository";

const requireId = (id, message) => {
  if (!id) throw new Error(message);
  return id;
};

export const commentService = {
  getComments: (postId) => commentRepository.getComments(requireId(postId, "Gönderi bulunamadı.")),

  postComment(postId, text) {
    const trimmed = text?.trim();
    if (!trimmed) throw new Error("Yorum boş bırakılamaz.");

    return commentRepository.postComment(requireId(postId, "Gönderi bulunamadı."), trimmed);
  },

  deleteComment: (commentId) => commentRepository.deleteComment(requireId(commentId, "Yorum bulunamadı.")),

  likeComment: (commentId) => commentRepository.likeComment(requireId(commentId, "Yorum bulunamadı.")),
};
