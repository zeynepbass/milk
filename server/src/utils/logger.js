import pino from "pino";
import { env } from "../config/env.js";

const usePrettyOutput = env.nodeEnv === "development" && process.stdout.isTTY;

export const logger = pino({
  level: env.isTest ? "silent" : env.logLevel,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "password",
      "*.password",
      "currentPassword",
      "*.currentPassword",
      "newPassword",
      "*.newPassword",
      "token",
      "*.token",
    ],
    censor: "[gizli]",
  },
  transport: usePrettyOutput
    ? { target: "pino-pretty", options: { translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname" } }
    : undefined,
});
