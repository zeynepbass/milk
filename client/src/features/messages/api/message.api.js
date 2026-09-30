import apiClient from "@/shared/api/apiClient";

export const messageApi = {
  getConversations: () => apiClient.get("/conversations"),
  getConversationWith: (userId) => apiClient.get(`/conversations/with/${userId}`),
  sendMessage: (payload) => apiClient.post("/messages", payload),
};
