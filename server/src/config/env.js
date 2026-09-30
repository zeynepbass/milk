import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const booleanFromString = z
  .enum(["true", "false", "1", "0"])
  .transform((value) => value === "true" || value === "1");

const optionalString = z
  .string()
  .optional()
  .transform((value) => value || undefined);

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5346),
    MONGO_URI: z.string().min(1, "MONGO_URI tanımlı olmalı"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET en az 32 karakter olmalı"),
    CLIENT_URLS: z.string().default("http://localhost:3000"),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
    TRUST_PROXY: booleanFromString.default(false),
    UPLOAD_DIR: z.string().default("uploads"),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
    STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
    S3_BUCKET: optionalString,
    S3_REGION: optionalString,
    S3_ENDPOINT: optionalString,
    S3_ACCESS_KEY_ID: optionalString,
    S3_SECRET_ACCESS_KEY: optionalString,
    S3_PUBLIC_URL: optionalString,
    REDIS_URL: optionalString,
    JOBS_ENABLED: booleanFromString.default(true),
    JOBS_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(1000),
  })
  .superRefine((values, context) => {
    if (values.STORAGE_DRIVER !== "s3") return;

    for (const key of ["S3_BUCKET", "S3_REGION", "S3_PUBLIC_URL"]) {
      if (!values[key]) {
        context.addIssue({ code: "custom", path: [key], message: `${key} S3 depolama için zorunlu` });
      }
    }
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
    storage: {
      driver: values.STORAGE_DRIVER,
      s3: {
        bucket: values.S3_BUCKET,
        region: values.S3_REGION,
        endpoint: values.S3_ENDPOINT,
        accessKeyId: values.S3_ACCESS_KEY_ID,
        secretAccessKey: values.S3_SECRET_ACCESS_KEY,
        publicUrl: values.S3_PUBLIC_URL?.replace(/\/$/, ""),
      },
    },
    redisUrl: values.REDIS_URL,
    jobs: {
      enabled: values.JOBS_ENABLED,
      pollIntervalMs: values.JOBS_POLL_INTERVAL_MS,
    },
  });
};

export const env = parseEnv(process.env);
