import { Server } from "socket.io";
import { isAllowedOrigin } from "../middleware/originCheck.js";
import { authenticateSocket, scheduleExpiryDisconnect } from "./auth.js";
import { attachSocketServer, userRoom } from "./emitter.js";
import { listOnlineUserIds, markOffline, markOnline } from "./presence.js";
import { registerMessageHandlers } from "./message.handlers.js";

const broadcastPresence = (io) => io.emit("presence:list", listOnlineUserIds());

export const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const { userId } = socket.data;

    socket.join(userRoom(userId));
    scheduleExpiryDisconnect(socket);
    registerMessageHandlers(socket);

    if (markOnline(userId)) {
      broadcastPresence(io);
    } else {
      socket.emit("presence:list", listOnlineUserIds());
    }

    socket.on("disconnect", () => {
      if (markOffline(userId)) broadcastPresence(io);
    });
  });

  attachSocketServer(io);
  return io;
};
