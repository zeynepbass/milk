import { commentApi } from "../api/comment.api";

export const commentRepository = {
  postComment(postId, text) {
    return commentApi.postComment(postId, text);
  },

  getComments(postId) {
    return commentApi.getComments(postId);
  },

  deleteComment(postId) {
    return commentApi.deleteComment(postId);
  },

  likeComment(postId) {
    return commentApi.likeComment(postId);
  },
};