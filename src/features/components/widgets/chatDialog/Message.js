import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Zeynep Baş",
    role: "Alıcı",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: 2,
    name: "Ahmet Yılmaz",
    role: "Satıcı",
    avatar: "https://i.pravatar.cc/40?img=6",
  },
  {
    id: 3,
    name: "Ali Can",
    role: "Alıcı",
    avatar: "https://i.pravatar.cc/40?img=7",
  },
];

export function MessageDialog() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Merhaba! Nasıl gidiyor?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { id: Date.now(), sender: "me", text: input }]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-50">

      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="font-semibold text-md text-gray-400 mb-4">Kullanıcılar</h2>
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-blue-50 ${
                selectedUser.id === user.id ? "bg-blue-100" : ""
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>


      <div className="flex-1 flex flex-col justify-between">

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded-lg shadow ${
                msg.sender === "me"
                  ? "bg-blue-100 text-gray-900 ml-auto" 
                  : "bg-gray-200 text-gray-800 mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>


        <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Mesajınızı ${selectedUser.name} için yazın...`}
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-400 hover:bg-blue-200 text-white font-bold rounded-lg transition"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}