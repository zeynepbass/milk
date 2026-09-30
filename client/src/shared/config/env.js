import { z } from "zod";

const envSchema = z.object({
  REACT_APP_SERVER_URL: z.url("REACT_APP_SERVER_URL geçerli bir URL olmalı").default("http://localhost:5346"),
});

const parsed = envSchema.safeParse({
  REACT_APP_SERVER_URL: process.env.REACT_APP_SERVER_URL || undefined,
});

if (!parsed.success) {
  throw new Error(`Geçersiz ortam değişkenleri: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`);
}

export const SERVER_URL = parsed.data.REACT_APP_SERVER_URL.replace(/\/$/, "");

export const API_BASE_URL = `${SERVER_URL}/api`;

export const toAssetUrl = (path) => {
  if (!path) return "";
  return path.startsWith("/uploads/") ? `${SERVER_URL}${path}` : path;
};
