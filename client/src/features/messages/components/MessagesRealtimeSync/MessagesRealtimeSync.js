import { useQueryClient } from "@tanstack/react-query";
import { useSocketEvent } from "@/shared/socket/SocketProvider";
import { useAuthStore } from "@/shared/store/useAuthStore";
import {
  addMessageToCache,
  applyMessageToConversations,
  markMessagesReadInCache,
} from "../../hooks/messageCache";

export function MessagesRealtimeSync() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);

  useSocketEvent("message:new", (message) => {
    addMessageToCache(queryClient, message);
    applyMessageToConversations(queryClient, message, { incrementUnread: message.receiverId === userId });
  });

  useSocketEvent("message:read", ({ conversationId, readerId, readAt }) => {
    markMessagesReadInCache(queryClient, conversationId, readerId, readAt);
  });

  return null;
}
