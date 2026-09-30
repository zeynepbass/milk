import { randomUUID } from "node:crypto";
import { pinoHttp } from "pino-http";
import { logger } from "../utils/logger.js";

const REQUEST_ID_PATTERN = /^[\w-]{8,64}$/;

const resolveRequestId = (req, res) => {
  const incoming = req.headers["x-request-id"];
  const id = typeof incoming === "string" && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID();

  res.setHeader("X-Request-Id", id);
  return id;
};

const resolveLogLevel = (req, res, err) => {
  if (err || res.statusCode >= 500) return "error";
  if (res.statusCode >= 400) return "warn";
  return "info";
};

export const requestLogger = pinoHttp({
  logger,
  genReqId: resolveRequestId,
  customLogLevel: resolveLogLevel,
  autoLogging: { ignore: (req) => req.url === "/health" },
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
