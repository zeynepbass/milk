import { useEffect, useState, useRef } from "react";
import { postService } from "@/features/services/postServices";
import { useUserStore } from "@/store";
import { io } from "socket.io-client";
export default function useMessage() {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const autoSentRef = useRef(false);

  const socketRef = useRef();

  const [productData, setProductData] = useState(() => {
    try {
      const data = localStorage.getItem("product");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await postService.postMessage(user,token);

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user,token]);

  useEffect(() => {
    if (!productData || !user?.id) return;

    setSelectedUser({
      _id: productData.userId,
      name: "Kullanıcı",
    });
  }, [productData]);

  const handleUserSelect = (u) => {
    setSelectedUser(u);
  };

  useEffect(() => {
    if (!selectedUser || !user?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await postService.postMessageGet(user,selectedUser);

        const data = await res.json();

        setMessages(data.messages || []);

        setSelectedUser((prev) => ({
          ...prev,
          conversationId: data._id,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);
  useEffect(() => {
    if (productData && selectedUser && !autoSentRef.current) {
        handleSend();
        autoSentRef.current = true;
      }
  }, [selectedUser, productData,autoSentRef]);
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
          msg.receiverId === selectedUser?._id
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => {
        socketRef.current.off("getUsers");
        socketRef.current.off("getMessage");
        socketRef.current.disconnect();
      };
  }, [user]);

  const handleSend = async () => {
    if ((!input.trim() && !productData) || !selectedUser) return;

    const text = productData ? `Ürün hakkında bilgi alabilir miyim?` : input;

    const body = {
      senderId: user.id,
      receiverId: selectedUser._id,
      text,
      conversationId: selectedUser.conversationId || null,
    };

    try {
  const res = await postService.postMessageSend(body);

      const newMsg = await res.json();

      setMessages((prev) => [...prev, newMsg]);
      setInput("");

      setConversations((prev) => {
        const exists = prev.find((c) => c._id === newMsg.conversationId);

        if (exists) {
          return prev.map((c) =>
            c._id === newMsg.conversationId ? { ...c, lastMessage: text } : c
          );
        }

        return [
          {
            _id: newMsg.conversationId,
            participants: [
              { _id: user.id },
              { _id: selectedUser._id, name: selectedUser.name },
            ],
            lastMessage: text,
          },
          ...prev,
        ];
      });

      if (productData) {
        localStorage.removeItem("product");
        setProductData(null);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getOtherUser = (conv) =>
    conv.participants.find((p) => p._id !== user.id);

  return {
    loading,
    conversations,
    getOtherUser,
    onlineUsers,
    handleUserSelect,
    messages,
    input,
    user,
    setInput,
    selectedUser,
    handleSend,
  };
}
