import apiClient from "@/shared/api";

export const commentService = {
  postComment: async (postId, text, token) => {
    const { data } = await apiClient.post(
      `/comments/${postId}`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  getComments: async (postId, token) => {
    const { data } = await apiClient.get(`/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  deleteComment: async (postId, token) => {
    const { data } = await apiClient.delete(`/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  likeComment: async (postId, token) => {
    const { data } = await apiClient.post(
      `/comments/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },
};