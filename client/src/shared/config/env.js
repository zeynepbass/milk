import { z } from "zod/mini";

const DEFAULT_SERVER_URL = "http://localhost:5346";

const serverUrlSchema = z.url({ error: "REACT_APP_SERVER_URL geçerli bir URL olmalı" });

const parsed = serverUrlSchema.safeParse(process.env.REACT_APP_SERVER_URL || DEFAULT_SERVER_URL);

if (!parsed.success) {
  throw new Error(
    `Geçersiz ortam değişkenleri: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`
  );
}

export const SERVER_URL = parsed.data.replace(/\/$/, "");

export const API_BASE_URL = `${SERVER_URL}/api`;

export const toAssetUrl = (path) => {
  if (!path) return "";
  return path.startsWith("/uploads/") ? `${SERVER_URL}${path}` : path;
};
