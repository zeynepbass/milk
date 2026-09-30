import apiClient from "@/shared/api/apiClient";

export const messageApi = {
  getConversations: () => apiClient.get("/conversations"),
  getConversationWith: (userId) => apiClient.get(`/conversations/with/${userId}`),
  getMessages: (conversationId, params) =>
    apiClient.get(`/conversations/${conversationId}/messages`, { params }),
  markRead: (conversationId) => apiClient.patch(`/conversations/${conversationId}/read`),
  sendMessage: (payload) => apiClient.post("/messages", payload),
};
