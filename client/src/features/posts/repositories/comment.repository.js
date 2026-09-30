import { commentApi } from "../api/comment.api";

const unwrap = async (request) => (await request).data;

export const commentRepository = {
  getComments: (postId, params) => unwrap(commentApi.getComments(postId, params)),
  addComment: (postId, text) => unwrap(commentApi.addComment(postId, text)),
  setLike: (commentId, liked) => unwrap(commentApi.setLike(commentId, liked)),
  deleteComment: (commentId) => unwrap(commentApi.deleteComment(commentId)),
};
