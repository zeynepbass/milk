import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../../../store";
import usePost from "features/hooks/feed/user/useUserPost";

export function MessageDialog() {
  const { users } = usePost(); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  const user = useUserStore((state) => state.user);


  useEffect(() => {
    if (users?.length > 0) setSelectedUser(users[0]);
  }, [users]);


  const handleUserSelect = async (u) => {
    setSelectedUser(u);
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:5346/api/conversations/${user.id}/${u._id}`);
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
  useEffect(() => {
    if (!user?.id) return;
  
    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `http://localhost:5346/api/conversations/${user.id}`
        );
        const data = await res.json();
  
        setConversations(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchConversations();
  }, [user]);
  const getOtherUser = (conv) => {
    return conv.participants.find((p) => p._id !== user.id);
  };
  return (
    <div className="flex h-screen bg-gray-50">

      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="font-semibold text-md text-gray-400 mb-4">Alıcı Kullanıcılar</h2>
        <ul className="space-y-3">
  {conversations.map((conv) => {
    const otherUser = getOtherUser(conv);

    return (
      <li
        key={conv._id}
        onClick={() => handleUserSelect(otherUser)}
        className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-blue-50"
      >
        <img
          src={otherUser?.avatar || "/images/default-avatar.png"}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{otherUser?.name}</p>
          <p className="text-xs text-gray-500">
            {conv.lastMessage}
          </p>
        </div>
      </li>
    );
  })}
</ul>
      </div>


      <div className="flex-1 flex flex-col justify-between p-4">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">Bu kullanıcıyla mesajlaşma yok</p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              ref={scrollRef}
              className={`max-w-xs p-3 rounded-lg shadow ${
                msg.senderId === user.id ? "bg-blue-100 text-gray-900 ml-auto" : "bg-gray-200 text-gray-800 mr-auto"
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
            placeholder={`Mesajınızı ${selectedUser?.name} için yazın...`}
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