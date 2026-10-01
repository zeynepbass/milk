import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";

export const LOCAL_URL_PREFIX = "/uploads/";

const resolveLocalPath = (url) => {
  if (typeof url !== "string" || !url.startsWith(LOCAL_URL_PREFIX)) return null;
  return path.join(env.uploadDir, path.basename(url.slice(LOCAL_URL_PREFIX.length)));
};

const privatePath = (key) => path.join(env.privateUploadDir, path.basename(key));

const unlinkIfExists = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
};

export const createLocalStorage = () => ({
  init() {
    fs.mkdirSync(env.uploadDir, { recursive: true });
    fs.mkdirSync(env.privateUploadDir, { recursive: true });
  },

  async save({ key, buffer }) {
    await fs.promises.writeFile(path.join(env.uploadDir, key), buffer);
    return `${LOCAL_URL_PREFIX}${key}`;
  },

  async remove(url) {
    const filePath = resolveLocalPath(url);
    if (filePath) await unlinkIfExists(filePath);
  },

  owns(url) {
    return Boolean(resolveLocalPath(url));
  },

  async savePrivate({ key, buffer }) {
    await fs.promises.writeFile(privatePath(key), buffer);
    return key;
  },

  async readPrivate(key) {
    await fs.promises.access(privatePath(key));
    return fs.createReadStream(privatePath(key));
  },

  removePrivate: (key) => unlinkIfExists(privatePath(key)),
});
