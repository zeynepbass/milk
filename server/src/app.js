import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { sanitizeRequest } from "./middleware/sanitize.js";
import { isAllowedOrigin } from "./middleware/originCheck.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { storage } from "./storage/index.js";
import { buildOpenApiDocument, SWAGGER_INIT_JS, SWAGGER_UI_HTML } from "./docs/openapi.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import messageRoutes from "./routes/message.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

const corsOptions = {
  origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  exposedHeaders: ["X-Request-Id"],
};

const DOCS_CSP =
  "default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' https://unpkg.com 'unsafe-inline'; img-src 'self' data:";

const DB_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

const healthCheck = (req, res) => {
  const database = DB_STATES[mongoose.connection.readyState] ?? "unknown";
  const healthy = database === "connected";

  res
    .status(healthy ? 200 : 503)
    .json({ status: healthy ? "ok" : "degraded", database, uptime: process.uptime() });
};

const mountDocs = (app) => {
  const document = buildOpenApiDocument();

  app.get("/api/docs/openapi.json", (req, res) => res.json(document));
  app.get("/api/docs/init.js", (req, res) => res.type("application/javascript").send(SWAGGER_INIT_JS));
  app.get("/api/docs", (req, res) =>
    res.set("Content-Security-Policy", DOCS_CSP).type("html").send(SWAGGER_UI_HTML)
  );
};

export const createApp = () => {
  storage.init();

  const app = express();

  app.set("trust proxy", env.trustProxy ? 1 : false);
  app.disable("x-powered-by");

  app.use(requestLogger);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ limit: "100kb", extended: false }));
  app.use(cookieParser());
  app.use(sanitizeRequest);

  app.use("/uploads", express.static(env.uploadDir, { dotfiles: "deny", index: false, maxAge: "7d" }));

  app.get("/health", healthCheck);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/conversations", conversationRoutes);

  mountDocs(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
