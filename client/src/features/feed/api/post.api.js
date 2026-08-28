import apiClient from "@/shared/api";

export const postApi = {
  getPosts: (params) => {
    return apiClient.get("/posts", { params });
  },

  getFollowingPosts: (params) => {
    return apiClient.get("/posts/following", { params });
  },

  createPost: (formData) => {
    return apiClient.post("/posts", formData);
  },

  getPostDetails: (id) => {
    return apiClient.get(`/posts/${id}`);
  },

  savePost: (id) => {
    return apiClient.post(`/posts/${id}/save`);
  },

  likePost: (id) => {
    return apiClient.post(`/posts/${id}/like/post`);
  },

  getSavedPosts: () => {
    return apiClient.get("/posts/users/saved-posts");
  },

  getMyPosts: () => {
    return apiClient.get("/posts/user/me");
  },

  deletePost: (id) => {
    return apiClient.delete(`/posts/${id}`);
  },

  followUser: (id) => {
    return apiClient.post(`/users/follow/${id}`);
  },

  updatePost: (id, formData) => {
    return apiClient.put(`/posts/${id}`, formData);
  },

  getConversation: (userId) => {
    return apiClient.get(`/conversations/${userId}`);
  },

  getConversationMessages: (userId, selectedUserId) => {
    return apiClient.get(
      `/conversations/${userId}/${selectedUserId}`
    );
  },

  sendFeedback: (payload) => {
    return apiClient.post("/users/feedback", payload);
  },

  sendMessage: (body) => {
    return apiClient.post("/messages/send", body);
  },

  getNotifications: () => {
    return apiClient.get("/posts/notifications");
  },

  markAsRead: (id) => {
    return apiClient.put(`/posts/markAsRead/${id}`);
  },
};