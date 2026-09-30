import { queryKeys } from "@/shared/query/queryKeys";
import { mapInfiniteItems, prependInfiniteItem } from "@/shared/query/infinite";

export const addMessageToCache = (queryClient, message) => {
  queryClient.setQueryData(queryKeys.conversations.messages(message.conversationId), (data) =>
    data ? prependInfiniteItem(data, message) : data
  );
};

export const replaceMessageInCache = (queryClient, conversationId, pendingId, message) => {
  queryClient.setQueryData(queryKeys.conversations.messages(conversationId), (data) => {
    if (!data) return data;
    const withoutPending = {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.filter((item) => item._id !== pendingId),
      })),
    };
    return prependInfiniteItem(withoutPending, message);
  });
};

export const markMessagesReadInCache = (queryClient, conversationId, readerId, readAt) => {
  queryClient.setQueryData(queryKeys.conversations.messages(conversationId), (data) =>
    mapInfiniteItems(data, (message) =>
      message.receiverId === readerId && !message.readAt ? { ...message, readAt } : message
    )
  );
};

export const applyMessageToConversations = (queryClient, message, { incrementUnread }) => {
  const key = queryKeys.conversations.list();
  const conversations = queryClient.getQueryData(key);
  const existing = conversations?.find((conversation) => conversation._id === message.conversationId);

  if (!existing) {
    queryClient.invalidateQueries({ queryKey: key });
    return;
  }

  const updated = {
    ...existing,
    lastMessage: message.text,
    lastMessageAt: message.createdAt,
    unreadCount: incrementUnread ? (existing.unreadCount ?? 0) + 1 : existing.unreadCount,
  };

  queryClient.setQueryData(key, [
    updated,
    ...conversations.filter((conversation) => conversation._id !== existing._id),
  ]);
};

export const resetUnreadInCache = (queryClient, conversationId) => {
  queryClient.setQueryData(queryKeys.conversations.list(), (conversations) =>
    conversations?.map((conversation) =>
      conversation._id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
    )
  );
};
