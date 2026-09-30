import { messageRepository } from "../repositories/message.repository";

const SOCKET_ACK_TIMEOUT_MS = 5000;

const sendOverSocket = async (socket, payload) => {
  const ack = await socket.timeout(SOCKET_ACK_TIMEOUT_MS).emitWithAck("message:send", payload);

  if (!ack?.ok) {
    throw new Error(ack?.message || "Mesaj gönderilemedi");
  }

  return ack.message;
};

export const messageService = {
  getConversations: () => messageRepository.getConversations(),

  getConversationWith: (userId) => messageRepository.getConversationWith(userId),

  sendMessage({ socket, receiverId, text }) {
    const trimmed = text?.trim();
    if (!trimmed) throw new Error("Mesaj boş olamaz");

    const payload = { receiverId, text: trimmed };

    return socket?.connected ? sendOverSocket(socket, payload) : messageRepository.sendMessage(payload);
  },
};
