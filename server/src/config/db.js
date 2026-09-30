import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async (uri) => {
  await mongoose.connect(uri);
  logger.info("MongoDB bağlantısı kuruldu");
};

export const disconnectDB = () => mongoose.disconnect();
