import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { createLocalStorage } from "./localStorage.js";
import { createS3Storage } from "./s3Storage.js";

export const storage = env.storage.driver === "s3" ? createS3Storage() : createLocalStorage();

export const removeStoredFiles = async (urls) => {
  const targets = urls.filter((url) => url && storage.owns(url));

  const results = await Promise.allSettled(targets.map((url) => storage.remove(url)));

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      logger.warn({ err: result.reason, url: targets[index] }, "Dosya silinemedi");
    }
  });
};
