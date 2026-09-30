import apiClient from "@/shared/api/apiClient";

export const accountApi = {
  getMe: () => apiClient.get("/users/me"),
  updateMe: (changes) => apiClient.patch("/users/me", changes),
  changeEmail: (payload) => apiClient.put("/users/me/email", payload),
  changePassword: (payload) => apiClient.put("/users/me/password", payload),
  updateAvatar: (formData) => apiClient.put("/users/me/avatar", formData),
  freeze: () => apiClient.post("/users/me/freeze"),
  deleteMe: (password) => apiClient.delete("/users/me", { data: { password } }),
  toggleFollow: (userId) => apiClient.post(`/users/follow/${userId}`),
  sendFeedback: (payload) => apiClient.post("/users/feedback", payload),
};
