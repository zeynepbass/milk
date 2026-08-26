import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

import Message from "./models/Message.js";

import messageRoutes from "./routes/message.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();


connectDB();


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});


const onlineUsers = new Map();

io.on("connection", (socket) => {

  socket.on("addUser", (userId) => {
    if (!userId) return;

    const userSockets = onlineUsers.get(userId) || [];

    if (!userSockets.includes(socket.id)) {
      userSockets.push(socket.id);
      onlineUsers.set(userId, userSockets);
    }

    io.emit("getUsers", Array.from(onlineUsers.keys()));
  });


  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, text, conversationId }) => {
      try {
        const message = await Message.create({
          senderId,
          receiverId,
          conversationId,
          text,
        });


        const receiverSockets = onlineUsers.get(receiverId);

        if (receiverSockets) {
          receiverSockets.forEach((socketId) => {
            io.to(socketId).emit("getMessage", message);
          });
        }


        socket.emit("getMessage", message);
      } catch (error) {
        console.error("❌ Mesaj hatası:", error);

        socket.emit("errorMessage", "Mesaj gönderilemedi");
      }
    }
  );


  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);

    for (const [userId, sockets] of onlineUsers.entries()) {
      const filteredSockets = sockets.filter(
        (socketId) => socketId !== socket.id
      );

      if (filteredSockets.length === 0) {
        onlineUsers.delete(userId);
      } else {
        onlineUsers.set(userId, filteredSockets);
      }
    }

    io.emit("getUsers", Array.from(onlineUsers.keys()));
  });
});


const PORT = process.env.PORT || 5346;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});