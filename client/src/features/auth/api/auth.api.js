import apiClient from "@/shared/api/apiClient";

export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  register: (payload) => apiClient.post("/auth/register", payload),
};
