import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import Message from "./models/Message.js";
import messageRoutes from "./routes/message.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

// ✅ Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ✅ Server + Socket
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// 🔥 Map yapısı (BEST PRACTICE)
let onlineUsers = new Map(); 
// userId => [socketId1, socketId2]

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // ✅ USER CONNECT
  socket.on("addUser", (userId) => {
    if (!userId) return;

    const userSockets = onlineUsers.get(userId) || [];

    // aynı socket tekrar eklenmesin
    if (!userSockets.includes(socket.id)) {
      userSockets.push(socket.id);
      onlineUsers.set(userId, userSockets);
    }

    io.emit("getUsers", Array.from(onlineUsers.keys()));
  });

  // ✅ SEND MESSAGE
  socket.on("sendMessage", async ({ senderId, receiverId, text, conversationId }) => {
    try {
      const message = await Message.create({
        senderId,
        receiverId,
        conversationId,
        text,
      });

      // 🔥 receiver'ın tüm socketlerine gönder
      const receiverSockets = onlineUsers.get(receiverId);

      if (receiverSockets) {
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("getMessage", message);
        });
      }

      // 🔥 sender'a geri gönder (UI sync için)
      socket.emit("getMessage", message);

    } catch (err) {
      console.error("❌ Mesaj hatası:", err);
      socket.emit("errorMessage", "Mesaj gönderilemedi");
    }
  });

  // ✅ DISCONNECT
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);

    for (let [userId, sockets] of onlineUsers.entries()) {
      const filtered = sockets.filter((id) => id !== socket.id);

      if (filtered.length === 0) {
        onlineUsers.delete(userId);
      } else {
        onlineUsers.set(userId, filtered);
      }
    }

    io.emit("getUsers", Array.from(onlineUsers.keys()));
  });
});

// ✅ PORT
const PORT = process.env.PORT || 5346;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);