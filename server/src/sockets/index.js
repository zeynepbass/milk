import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { isAllowedOrigin } from "../middleware/originCheck.js";
import { touchLastSeen } from "../services/user.service.js";
import { logger } from "../utils/logger.js";
import { authenticateSocket, scheduleExpiryDisconnect } from "./auth.js";
import { attachSocketServer, detachSocketServer, userRoom } from "./emitter.js";
import { createMemoryPresence, createRedisPresence } from "./presence.js";
import { registerMessageHandlers } from "./message.handlers.js";

const connectRedis = async (redisUrl) => {
  const publisher = createClient({ url: redisUrl });
  const subscriber = publisher.duplicate();

  publisher.on("error", (err) => logger.error({ err }, "Redis bağlantı hatası"));
  subscriber.on("error", (err) => logger.error({ err }, "Redis bağlantı hatası"));

  await Promise.all([publisher.connect(), subscriber.connect()]);
  return { publisher, subscriber };
};

const registerConnectionHandlers = (io, presence) => {
  io.on("connection", async (socket) => {
    const { userId } = socket.data;

    socket.join(userRoom(userId));
    scheduleExpiryDisconnect(socket);
    registerMessageHandlers(socket);

    socket.on("disconnect", async () => {
      try {
        if (await presence.disconnect(userId)) {
          io.emit("presence:update", { userId, online: false });
          await touchLastSeen(userId);
        }
      } catch (err) {
        logger.warn({ err, userId }, "Çevrimiçi durumu güncellenemedi");
      }
    });

    try {
      if (await presence.connect(userId)) {
        socket.broadcast.emit("presence:update", { userId, online: true });
      }
      socket.emit("presence:list", await presence.list());
    } catch (err) {
      logger.warn({ err, userId }, "Çevrimiçi durumu güncellenemedi");
    }
  });
};

export const createSocketServer = async (httpServer, { redisUrl } = {}) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
      credentials: true,
    },
  });

  let presence = createMemoryPresence();
  let redis = null;

  if (redisUrl) {
    redis = await connectRedis(redisUrl);
    io.adapter(createAdapter(redis.publisher, redis.subscriber));
    presence = createRedisPresence(redis.publisher);
    logger.info("Socket.io Redis adapter etkin");
  }

  io.use(authenticateSocket);
  registerConnectionHandlers(io, presence);
  attachSocketServer(io);

  const close = async () => {
    detachSocketServer();
    await new Promise((resolve) => io.close(() => resolve()));
    if (redis) await Promise.allSettled([redis.publisher.quit(), redis.subscriber.quit()]);
  };

  return { io, presence, close };
};
