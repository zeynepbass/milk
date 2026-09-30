import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

export const UPLOAD_URL_PREFIX = "/uploads/";

export const ensureUploadDir = () => {
  fs.mkdirSync(env.uploadDir, { recursive: true });
};

export const toUploadUrl = (filename) => `${UPLOAD_URL_PREFIX}${filename}`;

const resolveUploadPath = (url) => {
  if (typeof url !== "string" || !url.startsWith(UPLOAD_URL_PREFIX)) return null;

  const filename = path.basename(url.slice(UPLOAD_URL_PREFIX.length));
  return path.join(env.uploadDir, filename);
};

export const removeUploadedFile = async (url) => {
  const filePath = resolveUploadPath(url);
  if (!filePath) return;

  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      logger.warn({ err, url }, "Yüklenen dosya silinemedi");
    }
  }
};
