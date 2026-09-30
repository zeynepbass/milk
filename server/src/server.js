import http from "node:http";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { createSocketServer } from "./sockets/index.js";
import { logger } from "./utils/logger.js";

const start = async () => {
  await connectDB(env.mongoUri);

  const httpServer = http.createServer(createApp());
  const io = createSocketServer(httpServer);

  httpServer.listen(env.port, () => {
    logger.info({ port: env.port, clientUrls: env.clientUrls }, "Sunucu başlatıldı");
  });

  const shutdown = async (signal) => {
    logger.info({ signal }, "Sunucu kapatılıyor");
    io.close();
    httpServer.close();
    await disconnectDB();
    process.exit(0);
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
};

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Yakalanmamış promise reddi");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Yakalanmamış hata");
  process.exit(1);
});

start().catch((err) => {
  logger.fatal({ err }, "Sunucu başlatılamadı");
  process.exit(1);
});
