import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../../../store";
import usePost from "features/hooks/feed/user/useUserPost";

export function MessageDialog() {
  const { users } = usePost(); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-50">

      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="font-semibold text-md text-gray-400 mb-4">Alıcı Kullanıcılar</h2>
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              onClick={() => handleUserSelect(u)}
              className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-blue-50 ${
                selectedUser?._id === u._id ? "bg-blue-100" : ""
              }`}
            >
              <img
                src={u.avatar || "/images/default-avatar.png"}
                alt={u.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">{u.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>


      <div className="flex-1 flex flex-col justify-start p-4 overflow-y-auto space-y-3">
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
    </div>
  );
}