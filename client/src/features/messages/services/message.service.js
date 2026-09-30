import { messageRepository } from "../repositories/message.repository";

const SOCKET_ACK_TIMEOUT_MS = 5000;

const emitWithAck = async (socket, event, payload) => {
  const ack = await socket.timeout(SOCKET_ACK_TIMEOUT_MS).emitWithAck(event, payload);

  if (!ack?.ok) {
    throw new Error(ack?.message || "İşlem tamamlanamadı");
  }

  return ack;
};

export const messageService = {
  getConversations: () => messageRepository.getConversations(),

  getConversationWith: (userId) => messageRepository.getConversationWith(userId),

  getMessages: (conversationId, { cursor } = {}) =>
    messageRepository.getMessages(conversationId, cursor ? { cursor } : undefined),

  async sendMessage({ socket, receiverId, text }) {
    const trimmed = text?.trim();
    if (!trimmed) throw new Error("Mesaj boş olamaz");

    const payload = { receiverId, text: trimmed };

    if (socket?.connected) {
      return (await emitWithAck(socket, "message:send", payload)).message;
    }

    return messageRepository.sendMessage(payload);
  },

  markRead: ({ socket, conversationId }) =>
    socket?.connected
      ? emitWithAck(socket, "conversation:read", { conversationId })
      : messageRepository.markRead(conversationId),

  otherParticipant: (conversation, userId) =>
    conversation?.participants?.find((participant) => participant && participant._id !== userId) ?? null,
};
