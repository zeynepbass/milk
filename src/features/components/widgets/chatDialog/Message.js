import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../../../store";
import usePost from "features/hooks/feed/user/useUserPost";
import { io } from "socket.io-client";
export function MessageDialog() {
  const { users } = usePost();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  const user = useUserStore((state) => state.user);
  const socketRef = useRef();

  useEffect(() => {
    if (users?.length > 0) setSelectedUser();
  }, [users]);

  const handleUserSelect = async (u) => {
    setSelectedUser(u);
    if (!user?.id) return;

    try {
      const res = await fetch(
        `http://localhost:5346/api/conversations/${user.id}/${u._id}`
      );
      const data = await res.json();

      setMessages(data.messages || []);
    } catch (err) {
      console.error("Mesajlar alınamadı:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;

    const body = {
      senderId: user.id,
      receiverId: selectedUser._id,
      text: input,
      conversationId: selectedUser.conversationId || null,
    };

    try {
      const res = await fetch("http://localhost:5346/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const newMsg = await res.json();

      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5346/api/conversations/${user.id}`
        );
        const data = await res.json();

        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);
  const getOtherUser = (conv) => {
    return conv.participants.find((p) => p._id !== user.id);
  };
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = io("http://localhost:5346");

    socketRef.current.emit("addUser", user.id);

    socketRef.current.on("getUsers", (users) => {
      setOnlineUsers(users.map((u) => u.userId));
    });

    socketRef.current.on("getMessage", (msg) => {
      if (
        msg.senderId === selectedUser?._id ||
        msg.receiverId === selectedUser?.id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socketRef.current.disconnect();
  }, [user, selectedUser]);
  useEffect(() => {
    if (!selectedUser || !user?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5346/api/conversations/${user.id}/${selectedUser._id}`
        );
        const data = await res.json();
        setMessages(data.messages || []);

        setSelectedUser((prev) => ({ ...prev, conversationId: data._id }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);
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

      <div className="flex-1 flex flex-col justify-between p-4">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages?.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Herhangi bir sohbet bulunamadı
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              ref={scrollRef}
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
