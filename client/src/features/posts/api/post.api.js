import apiClient from "@/shared/api/apiClient";

export const postApi = {
  getPosts: (params) => apiClient.get("/posts", { params }),
  getFollowingPosts: (params) => apiClient.get("/posts/following", { params }),
  getSavedPosts: () => apiClient.get("/posts/users/saved-posts"),
  getMyPosts: () => apiClient.get("/posts/user/me"),
  getPostDetails: (id) => apiClient.get(`/posts/${id}`),
  createPost: (formData) => apiClient.post("/posts", formData),
  updatePost: (id, formData) => apiClient.put(`/posts/${id}`, formData),
  deletePost: (id) => apiClient.delete(`/posts/${id}`),
  likePost: (id) => apiClient.post(`/posts/${id}/like/post`),
  savePost: (id) => apiClient.post(`/posts/${id}/save`),
};
