import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { queryKeys } from "@/shared/query/queryKeys";
import { pageParamsFromCursor } from "@/shared/query/infinite";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useSocket } from "@/shared/socket/SocketProvider";
import { messageService } from "../services/message.service";
import {
  addMessageToCache,
  applyMessageToConversations,
  markMessagesReadInCache,
  replaceMessageInCache,
  resetUnreadInCache,
} from "./messageCache";

export function useConversations() {
  return useQuery({ queryKey: queryKeys.conversations.list(), queryFn: () => messageService.getConversations() });
}

export function useConversationWith(userId) {
  return useQuery({
    queryKey: queryKeys.conversations.withUser(userId),
    queryFn: () => messageService.getConversationWith(userId),
    enabled: Boolean(userId),
  });
}

export function useConversationMessages(conversationId) {
  return useInfiniteQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: ({ pageParam }) => messageService.getMessages(conversationId, { cursor: pageParam }),
    enabled: Boolean(conversationId),
    ...pageParamsFromCursor,
  });
}

export function useSendMessage({ conversationId, receiverId }) {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const userId = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (text) => messageService.sendMessage({ socket, receiverId, text }),
    onMutate: (text) => {
      if (!conversationId) return {};

      const pending = {
        _id: `pending-${Date.now()}`,
        conversationId,
        senderId: userId,
        receiverId,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        pending: true,
      };
      addMessageToCache(queryClient, pending);
      return { pendingId: pending._id };
    },
    onSuccess: (message, text, context) => {
      if (context?.pendingId) {
        replaceMessageInCache(queryClient, message.conversationId, context.pendingId, message);
      } else {
        addMessageToCache(queryClient, message);
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations.withUser(receiverId) });
      }
      applyMessageToConversations(queryClient, message, { incrementUnread: false });
    },
    onError: (error, text, context) => {
      if (context?.pendingId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations.messages(conversationId) });
      }
      toast.error(getErrorMessage(error, error.message || "Mesaj gönderilemedi"));
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const userId = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (conversationId) => messageService.markRead({ socket, conversationId }),
    onMutate: (conversationId) => resetUnreadInCache(queryClient, conversationId),
    onSuccess: (result, conversationId) => {
      markMessagesReadInCache(queryClient, conversationId, userId, result.readAt ?? new Date().toISOString());
    },
  });
}
