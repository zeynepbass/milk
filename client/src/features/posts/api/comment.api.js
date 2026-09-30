import apiClient from "@/shared/api/apiClient";

export const commentApi = {
  getComments: (postId, params) => apiClient.get(`/posts/${postId}/comments`, { params }),
  addComment: (postId, text) => apiClient.post(`/posts/${postId}/comments`, { text }),
  setLike: (commentId, liked) => (liked ? apiClient.put : apiClient.delete)(`/comments/${commentId}/like`),
  deleteComment: (commentId) => apiClient.delete(`/comments/${commentId}`),
};
