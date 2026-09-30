import http from "node:http";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { createSocketServer } from "./sockets/index.js";
import { registerJobHandlers, startJobWorker } from "./jobs/index.js";
import { logger } from "./utils/logger.js";

const SHUTDOWN_TIMEOUT_MS = 10000;

const closeHttpServer = (server) =>
  new Promise((resolve) => {
    server.close(() => resolve());
    server.closeIdleConnections?.();
  });

const start = async () => {
  await connectDB(env.mongoUri);
  registerJobHandlers();

  const httpServer = http.createServer(createApp());
  const sockets = await createSocketServer(httpServer, { redisUrl: env.redisUrl });
  const stopWorker = env.jobs.enabled ? startJobWorker({ pollIntervalMs: env.jobs.pollIntervalMs }) : async () => {};

  httpServer.listen(env.port, () => {
    logger.info({ port: env.port, clientUrls: env.clientUrls }, "Sunucu başlatıldı");
  });

  let shuttingDown = false;

  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "Sunucu kapatılıyor");

    const forceExit = setTimeout(() => {
      logger.error("Kapanış zaman aşımına uğradı, süreç sonlandırılıyor");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    await sockets.close();
    await closeHttpServer(httpServer);
    await stopWorker();
    await disconnectDB();

    logger.info("Sunucu kapatıldı");
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
