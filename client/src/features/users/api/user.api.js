import apiClient from "@/shared/api/apiClient";

export const userApi = {
  getProfile: (userId) => apiClient.get(`/users/${userId}`),
  getFollowers: (userId, params) => apiClient.get(`/users/${userId}/followers`, { params }),
  getFollowing: (userId, params) => apiClient.get(`/users/${userId}/following`, { params }),
  setFollow: (userId, following) => (following ? apiClient.put : apiClient.delete)(`/users/${userId}/follow`),
};
