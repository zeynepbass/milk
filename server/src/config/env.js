import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const booleanFromString = z
  .enum(["true", "false", "1", "0"])
  .transform((value) => value === "true" || value === "1");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5346),
  MONGO_URI: z.string().min(1, "MONGO_URI tanımlı olmalı"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET en az 32 karakter olmalı"),
  CLIENT_URLS: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  TRUST_PROXY: booleanFromString.default(false),
  UPLOAD_DIR: z.string().default("uploads"),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
});

const formatIssues = (issues) =>
  issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");

const parseEnv = (source) => {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    throw new Error(`Geçersiz ortam değişkenleri:\n${formatIssues(result.error.issues)}`);
  }

  const values = result.data;

  return Object.freeze({
    nodeEnv: values.NODE_ENV,
    isProduction: values.NODE_ENV === "production",
    isTest: values.NODE_ENV === "test",
    port: values.PORT,
    mongoUri: values.MONGO_URI,
    jwtSecret: values.JWT_SECRET,
    clientUrls: values.CLIENT_URLS.split(",")
      .map((url) => url.trim())
      .filter(Boolean),
    logLevel: values.LOG_LEVEL,
    trustProxy: values.TRUST_PROXY,
    uploadDir: path.resolve(values.UPLOAD_DIR),
    accessTokenTtlSeconds: values.ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlMs: values.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
};

export const env = parseEnv(process.env);
