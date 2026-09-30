import { messageApi } from "../api/message.api";

const unwrap = async (request) => (await request).data;

export const messageRepository = {
  getConversations: () => unwrap(messageApi.getConversations()),
  getConversationWith: (userId) => unwrap(messageApi.getConversationWith(userId)),
  getMessages: (conversationId, params) => unwrap(messageApi.getMessages(conversationId, params)),
  markRead: (conversationId) => unwrap(messageApi.markRead(conversationId)),
  sendMessage: (payload) => unwrap(messageApi.sendMessage(payload)),
};
