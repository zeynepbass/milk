import apiClient from "@/shared/constants";

export const commentApi = {
  postComment(postId, text) {
    return apiClient.post(`/comments/${postId}`, {
      text,
    });
  },

  getComments(postId) {
    return apiClient.get(`/comments/${postId}`);
  },

  deleteComment(postId) {
    return apiClient.delete(`/comments/${postId}`);
  },

  likeComment(postId) {
    return apiClient.post(`/comments/${postId}/like`);
  },
};