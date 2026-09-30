import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { createAuthenticatedSocket } from "@/shared/api/socket";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { messageService } from "../services/message.service";

const appendUnique = (messages, message) =>
  messages.some((item) => item._id === message._id) ? messages : [...messages, message];

const buildProductQuestion = (product) =>
  product.title ? `"${product.title}" hakkında bilgi alabilir miyim?` : "Ürün hakkında bilgi alabilir miyim?";

export function useMessages() {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product ?? null;

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const selectedUserIdRef = useRef(null);
  const productSentRef = useRef(false);

  useEffect(() => {
    selectedUserIdRef.current = selectedUser?._id ?? null;
  }, [selectedUser?._id]);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      setConversations(await messageService.getConversations());
    } catch (error) {
      toast.error(getErrorMessage(error, "Sohbetler alınamadı"));
    } finally {
      setLoading(false);
    }
  }, []);

  const conversationIdsRef = useRef(new Set());

  useEffect(() => {
    conversationIdsRef.current = new Set(conversations.map((conversation) => conversation._id));
  }, [conversations]);

  const applyMessageToConversations = useCallback(
    (message) => {
      if (!conversationIdsRef.current.has(message.conversationId)) {
        loadConversations();
        return;
      }

      setConversations((prev) => {
        const existing = prev.find((conversation) => conversation._id === message.conversationId);
        if (!existing) return prev;

        const updated = { ...existing, lastMessage: message.text, lastMessageAt: message.createdAt };
        return [updated, ...prev.filter((conversation) => conversation._id !== existing._id)];
      });
    },
    [loadConversations]
  );

  useEffect(() => {
    if (userId) loadConversations();
  }, [userId, loadConversations]);

  useEffect(() => {
    if (!userId) return undefined;

    const socket = createAuthenticatedSocket();
    socketRef.current = socket;

    socket.on("presence:list", setOnlineUsers);

    socket.on("message:new", (message) => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;

      if (otherUserId === selectedUserIdRef.current) {
        setMessages((prev) => appendUnique(prev, message));
      }

      applyMessageToConversations(message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, applyMessageToConversations]);

  useEffect(() => {
    if (product?.userId) {
      setSelectedUser({ _id: product.userId, name: product.userName || "Satıcı" });
    }
  }, [product?.userId, product?.userName]);

  useEffect(() => {
    if (!selectedUser?._id) return undefined;

    let ignore = false;

    messageService
      .getConversationWith(selectedUser._id)
      .then((conversation) => {
        if (!ignore) setMessages(conversation.messages || []);
      })
      .catch((error) => {
        if (!ignore) toast.error(getErrorMessage(error, "Mesajlar alınamadı"));
      });

    return () => {
      ignore = true;
    };
  }, [selectedUser?._id]);

  const sendText = useCallback(
    async (text, receiverId) => {
      const message = await messageService.sendMessage({ socket: socketRef.current, receiverId, text });
      setMessages((prev) => appendUnique(prev, message));
      applyMessageToConversations(message);
    },
    [applyMessageToConversations]
  );

  useEffect(() => {
    if (!product?.userId || selectedUser?._id !== product.userId || productSentRef.current) return;

    productSentRef.current = true;

    sendText(buildProductQuestion(product), product.userId)
      .catch((error) => toast.error(getErrorMessage(error, error.message || "Mesaj gönderilemedi")))
      .finally(() => navigate(location.pathname, { replace: true, state: null }));
  }, [product, selectedUser?._id, sendText, navigate, location.pathname]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;

    try {
      await sendText(input, selectedUser._id);
      setInput("");
    } catch (error) {
      toast.error(getErrorMessage(error, error.message || "Mesaj gönderilemedi"));
    }
  };

  const getOtherUser = (conversation) =>
    conversation.participants.find((participant) => participant && participant._id !== userId);

  return {
    loading,
    conversations,
    getOtherUser,
    onlineUsers,
    handleUserSelect: setSelectedUser,
    messages,
    input,
    user,
    setInput,
    selectedUser,
    handleSend,
  };
}
