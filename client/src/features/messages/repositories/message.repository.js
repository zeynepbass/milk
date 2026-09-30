import { messageApi } from "../api/message.api";

const unwrap = async (request) => (await request).data;

export const messageRepository = {
  getConversations: () => unwrap(messageApi.getConversations()),
  getConversationWith: (userId) => unwrap(messageApi.getConversationWith(userId)),
  sendMessage: (payload) => unwrap(messageApi.sendMessage(payload)),
};
