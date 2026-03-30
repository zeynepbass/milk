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
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="font-semibold text-md text-gray-400 mb-4">
          Alıcı Kullanıcılar
        </h2>

        {loading && (
          <p className="text-center text-gray-400 mb-2">Yükleniyor...</p>
        )}

        <ul className="space-y-3">
          {conversations.map((conv) => {
            const otherUser = getOtherUser(conv);
            const isOnline = onlineUsers.includes(otherUser._id);

            return (
              <li
                key={conv._id}
                onClick={() => handleUserSelect(otherUser)}
                className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-blue-50 ${
                  selectedUser?._id === otherUser._id ? "bg-blue-100" : ""
                }`}
              >
                <div className="flex-shrink-0 mr-3 relative">
                  <img
                    src={otherUser?.avatar || "/images/default-avatar.png"}
                    alt={otherUser?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800 truncate">
                      {otherUser?.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {conv.lastMessage || "Henüz mesaj yok"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Herhangi bir sohbet bulunamadı
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs p-3 rounded-lg shadow ${
                msg.senderId === user.id
                  ? "bg-blue-100 text-gray-900 ml-auto"
                  : "bg-gray-200 text-gray-800 mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedUser
                ? `Mesajınızı ${selectedUser.name} için yazın`
                : "Kullanıcı seçin"
            }
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
