import { commentApi } from "../api/comment.api";

const unwrap = async (request) => (await request).data;

export const commentRepository = {
  getComments: (postId) => unwrap(commentApi.getComments(postId)),
  postComment: (postId, text) => unwrap(commentApi.postComment(postId, text)),
  deleteComment: (commentId) => unwrap(commentApi.deleteComment(commentId)),
  likeComment: (commentId) => unwrap(commentApi.likeComment(commentId)),
};
