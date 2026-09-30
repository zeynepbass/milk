import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";

export const LOCAL_URL_PREFIX = "/uploads/";

const resolveLocalPath = (url) => {
  if (typeof url !== "string" || !url.startsWith(LOCAL_URL_PREFIX)) return null;
  return path.join(env.uploadDir, path.basename(url.slice(LOCAL_URL_PREFIX.length)));
};

export const createLocalStorage = () => ({
  init() {
    fs.mkdirSync(env.uploadDir, { recursive: true });
  },

  async save({ key, buffer }) {
    await fs.promises.writeFile(path.join(env.uploadDir, key), buffer);
    return `${LOCAL_URL_PREFIX}${key}`;
  },

  async remove(url) {
    const filePath = resolveLocalPath(url);
    if (!filePath) return;

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  },

  owns(url) {
    return Boolean(resolveLocalPath(url));
  },
});
