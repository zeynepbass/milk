import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const watchConnection = () => {
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB bağlantısı koptu"));
  mongoose.connection.on("reconnected", () => logger.info("MongoDB bağlantısı yeniden kuruldu"));
  mongoose.connection.on("error", (err) => logger.error({ err }, "MongoDB bağlantı hatası"));
};

export const connectDB = async (uri) => {
  watchConnection();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      logger.info("MongoDB bağlantısı kuruldu");
      return;
    } catch (err) {
      if (attempt === MAX_ATTEMPTS) throw err;

      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      logger.warn({ err: err.message, attempt, delay }, "MongoDB bağlantısı kurulamadı, tekrar denenecek");
      await wait(delay);
    }
  }
};

export const disconnectDB = () => mongoose.disconnect();
