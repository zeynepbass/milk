import { useEffect, useMemo, useRef } from "react";
import { Avatar } from "@/shared/components/atoms";
import { LoadMore } from "@/shared/components/molecules";
import { flattenPages } from "@/shared/query/infinite";
import { usePresence } from "@/shared/socket/usePresence";
import { useAuthStore } from "@/shared/store/useAuthStore";
import {
  useConversationMessages,
  useConversationWith,
  useMarkConversationRead,
  useSendMessage,
} from "../../hooks/useConversations";
import { MessageBubble } from "../MessageBubble";
import { MessageComposer } from "../MessageComposer";

export function ChatWindow({ partner, initialMessage, onInitialMessageSent }) {
  const userId = useAuthStore((state) => state.userId);
  const online = usePresence();
  const conversation = useConversationWith(partner?._id);
  const conversationId = conversation.data?._id ?? null;
  const messagesQuery = useConversationMessages(conversationId);
  const { mutate: sendMessage, isPending: sending } = useSendMessage({
    conversationId,
    receiverId: partner?._id,
  });
  const { mutate: markRead, isPending: markingRead } = useMarkConversationRead();
  const initialSentRef = useRef(false);
  const bottomRef = useRef(null);

  const messages = useMemo(() => [...flattenPages(messagesQuery.data)].reverse(), [messagesQuery.data]);
  const unreadCount = messages.filter((message) => message.receiverId === userId && !message.readAt).length;
  const lastReadAttemptRef = useRef(null);

  useEffect(() => {
    const attempt = `${conversationId}:${unreadCount}`;
    if (!conversationId || unreadCount === 0 || markingRead || lastReadAttemptRef.current === attempt) return;

    lastReadAttemptRef.current = attempt;
    markRead(conversationId);
  }, [conversationId, unreadCount, markingRead, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    if (!initialMessage || initialSentRef.current || !conversation.isSuccess) return;
    initialSentRef.current = true;
    sendMessage(initialMessage, { onSettled: onInitialMessageSent });
  }, [initialMessage, conversation.isSuccess, sendMessage, onInitialMessageSent]);

  if (!partner) {
    return (
      <section className="flex-1 flex items-center justify-center text-gray-500">
        Mesajlaşmak için bir sohbet seç
      </section>
    );
  }

  const displayPartner = conversation.data?.participants?.find((item) => item._id === partner._id) ?? partner;

  return (
    <section
      aria-label={`${displayPartner.name ?? "Kullanıcı"} ile sohbet`}
      className="flex-1 flex flex-col min-h-0"
    >
      <header className="h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center gap-3 px-4">
        <Avatar user={displayPartner} />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {displayPartner.name} {displayPartner.surname}
          </p>
          <p className="text-xs text-gray-500">{online.has(partner._id) ? "Çevrimiçi" : "Çevrimdışı"}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900" aria-live="polite">
        <LoadMore query={messagesQuery} label="Önceki mesajlar" />
        {messages.length === 0 && <p className="text-center text-gray-500 mt-10">Henüz mesaj yok</p>}
        <ul className="space-y-3">
          {messages.map((message) => (
            <MessageBubble key={message._id} message={message} isMine={message.senderId === userId} />
          ))}
        </ul>
        <div ref={bottomRef} />
      </div>

      <MessageComposer disabled={!partner} pending={sending} onSend={(text) => sendMessage(text)} />
    </section>
  );
}
