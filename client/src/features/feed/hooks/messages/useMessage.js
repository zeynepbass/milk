import { useEffect, useState, useRef } from "react";
import { postProvider } from "@/providers/post.provider";
import { useUserStore } from "@/shared/store/useUserStore";
import { io } from "socket.io-client";

export default function useMessage() {
  const user = useUserStore((state) => state.user);

  const userId = user?._id || user?.id;

  const service = postProvider.service;

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const autoSentRef = useRef(false);

  const [productData, setProductData] = useState(() => {
    try {
      const data = localStorage.getItem("product");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });


  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);

        const res = await service.getConversation(userId);

        setConversations(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId]);


  useEffect(() => {
    if (!productData || !userId) return;

    setSelectedUser({
      _id: productData.userId,
      name: "Kullanıcı",
    });
  }, [productData, userId]);

  const handleUserSelect = (u) => {
    setSelectedUser(u);
  };


  useEffect(() => {
    if (!selectedUser?._id || !userId) return;

    const fetchMessages = async () => {
      try {
        const res =
          await service.getConversationMessages(
            userId,
            selectedUser._id
          );

        setMessages(res.messages || []);

        setSelectedUser((prev) =>
          prev?.conversationId
            ? prev
            : {
                ...prev,
                conversationId: res._id,
              }
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser?._id, userId]);


  useEffect(() => {
    if (
      productData &&
      selectedUser &&
      !autoSentRef.current
    ) {
      handleSend();
      autoSentRef.current = true;
    }
  }, [productData, selectedUser]);


  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5346");

    socketRef.current = socket;

    socket.emit("addUser", userId);

    socket.on("getUsers", (users) => {
      setOnlineUsers(
        users.map((u) => u.userId)
      );
    });

    socket.on("getMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m._id === msg._id
        );

        if (exists) return prev;

        if (
          msg.senderId === selectedUser?._id ||
          msg.receiverId === selectedUser?._id
        ) {
          return [...prev, msg];
        }

        return prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedUser?._id]);


  const handleSend = async () => {
    if (
      (!input.trim() && !productData) ||
      !selectedUser
    ) {
      return;
    }

    const text = productData
      ? "Ürün hakkında bilgi alabilir miyim?"
      : input;

    const body = {
      senderId: userId,
      receiverId: selectedUser._id,
      text,
      conversationId:
        selectedUser.conversationId || null,
    };

    try {
      const savedMessage =
        await service.sendMessage(body);

      setMessages((prev) => [
        ...prev,
        savedMessage,
      ]);

      setInput("");

      setConversations((prev) => {
        const exists = prev.find(
          (c) =>
            c._id === savedMessage.conversationId
        );

        if (exists) {
          return prev.map((c) =>
            c._id ===
            savedMessage.conversationId
              ? {
                  ...c,
                  lastMessage: text,
                }
              : c
          );
        }

        return [
          {
            _id: savedMessage.conversationId,
            participants: [
              { _id: userId },
              {
                _id: selectedUser._id,
                name: selectedUser.name,
              },
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
      console.log(
        "Mesaj gönderilemedi:",
        err
      );
    }
  };

  const getOtherUser = (conv) =>
    conv.participants.find(
      (p) => p._id !== userId
    );

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