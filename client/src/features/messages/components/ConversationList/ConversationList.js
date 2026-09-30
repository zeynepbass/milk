import { Avatar } from "@/shared/components/atoms";
import { QueryState } from "@/shared/components/molecules";
import { usePresence } from "@/shared/socket/usePresence";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { messageService } from "../../services/message.service";
import { useConversations } from "../../hooks/useConversations";

export function ConversationList({ selectedUserId, onSelect }) {
  const query = useConversations();
  const online = usePresence();
  const userId = useAuthStore((state) => state.userId);
  const conversations = query.data ?? [];

  return (
    <nav
      aria-label="Sohbetler"
      className="w-full md:w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col"
    >
      <h2 className="p-4 border-b dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
        Sohbetler
      </h2>

      <div className="flex-1 overflow-y-auto p-3">
        <QueryState
          query={query}
          isEmpty={conversations.length === 0}
          empty={<p className="text-center text-sm text-gray-500 py-6">Henüz sohbetin yok</p>}
        >
          <ul className="space-y-2">
            {conversations.map((conversation) => {
              const other = messageService.otherParticipant(conversation, userId);
              if (!other) return null;

              const selected = other._id === selectedUserId;
              const isOnline = online.has(other._id);

              return (
                <li key={conversation._id}>
                  <button
                    type="button"
                    aria-current={selected ? "true" : undefined}
                    onClick={() => onSelect(other)}
                    className={`flex w-full text-left items-center gap-3 p-2 rounded-xl transition ${
                      selected ? "bg-blue-100 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="relative">
                      <Avatar user={other} />
                      <span
                        aria-label={isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                        role="img"
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="block font-medium text-gray-800 dark:text-gray-200 truncate">
                        {other.name} {other.surname}
                      </span>
                      <span className="block text-xs text-gray-500 truncate">
                        {conversation.lastMessage || "Henüz mesaj yok"}
                      </span>
                    </span>

                    {conversation.unreadCount > 0 && (
                      <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        <span className="sr-only">Okunmamış mesaj: </span>
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </QueryState>
      </div>
    </nav>
  );
}
