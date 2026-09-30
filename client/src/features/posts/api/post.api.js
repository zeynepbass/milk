import apiClient from "@/shared/api/apiClient";

const FEED_PATHS = {
  explore: "/posts",
  following: "/posts/following",
  saved: "/posts/saved",
  mine: "/posts/mine",
};

export const postApi = {
  getFeed: (scope, params) => apiClient.get(FEED_PATHS[scope], { params }),
  getUserPosts: (userId, params) => apiClient.get(`/users/${userId}/posts`, { params }),
  getPost: (postId) => apiClient.get(`/posts/${postId}`),
  createPost: (formData) => apiClient.post("/posts", formData),
  updatePost: (postId, formData) => apiClient.patch(`/posts/${postId}`, formData),
  deletePost: (postId) => apiClient.delete(`/posts/${postId}`),
  setLike: (postId, liked) => (liked ? apiClient.put : apiClient.delete)(`/posts/${postId}/like`),
  setSave: (postId, saved) => (saved ? apiClient.put : apiClient.delete)(`/posts/${postId}/save`),
};
