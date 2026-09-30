import apiClient from "@/shared/api/apiClient";

export const commentApi = {
  getComments: (postId) => apiClient.get(`/comments/${postId}`),
  postComment: (postId, text) => apiClient.post(`/comments/${postId}`, { text }),
  deleteComment: (commentId) => apiClient.delete(`/comments/${commentId}`),
  likeComment: (commentId) => apiClient.post(`/comments/${commentId}/like`),
};
