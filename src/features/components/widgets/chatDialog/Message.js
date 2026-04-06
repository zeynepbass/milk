import useMessage from "@/features/hooks/feed/messages/useMessage";
export function MessageDialog() {
  const {
    loading,
    conversations,
    user,
    getOtherUser,
    onlineUsers,
    handleUserSelect,
    messages,
    input,
    setInput,
    selectedUser,
    handleSend,
  } = useMessage();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">

        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300">
            Sohbetler
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && (
            <p className="text-center text-gray-400">Yükleniyor...</p>
          )}

          {conversations.map((conv) => {
            const otherUser = getOtherUser(conv);
            const isOnline = onlineUsers.includes(otherUser._id);

            return (
              <div
                key={conv._id}
                onClick={() => handleUserSelect(otherUser)}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition
                  ${
                    selectedUser?._id === otherUser._id
                      ? "bg-blue-100 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <div className="relative">
                  <img
                    src={otherUser?.avatar || "/images/footer-logo.png"}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                      ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {otherUser?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {conv.lastMessage || "Henüz mesaj yok"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      <div className="flex-1 flex flex-col">

        <div className="h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center px-4">
      
            <div className="flex items-center gap-3">
              <img
                src={selectedUser?.avatar || "/images/footer-logo.png"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {selectedUser?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {onlineUsers.includes(selectedUser?._id)
                    ? "Çevrimiçi"
                    : "Çevrimdışı"}
                </p>
              </div>
            </div>
        
        </div>


        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              Mesaj yok
            </p>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.senderId === user._id;

            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow
                    ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>


        <div className="p-3 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedUser
                ? `Mesaj yaz...`
                : "Önce kullanıcı seç"
            }
            className="flex-1 px-4 py-2 rounded-full border dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}