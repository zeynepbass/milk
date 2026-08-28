import { commentRepository } from "../repositories/comment.repository";

export const commentService = {
  async postComment(postId, text) {
    if (!postId) {
      throw new Error("Post ID bulunamadı.");
    }

    if (!text?.trim()) {
      throw new Error("Yorum boş bırakılamaz.");
    }

    const { data } =
      await commentRepository.postComment(
        postId,
        text.trim()
      );

    return data;
  },

  async getComments(postId) {
    if (!postId) {
      throw new Error("Post ID bulunamadı.");
    }

    const { data } =
      await commentRepository.getComments(postId);

    return data;
  },

  async deleteComment(postId) {
    if (!postId) {
      throw new Error("Comment ID bulunamadı.");
    }

    const { data } =
      await commentRepository.deleteComment(postId);

    return data;
  },

  async likeComment(postId) {
    if (!postId) {
      throw new Error("Comment ID bulunamadı.");
    }

    const { data } =
      await commentRepository.likeComment(postId);

    return data;
  },
};