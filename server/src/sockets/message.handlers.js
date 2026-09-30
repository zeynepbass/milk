import { sendMessage } from "../services/message.service.js";
import { parseOrThrow } from "../middleware/validate.js";
import { sendMessageBody } from "../validators/message.validators.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

const RATE_WINDOW_MS = 10 * 1000;
const RATE_MAX_MESSAGES = 20;

const createRateGuard = () => {
  let timestamps = [];

  return () => {
    const now = Date.now();
    timestamps = timestamps.filter((time) => now - time < RATE_WINDOW_MS);

    if (timestamps.length >= RATE_MAX_MESSAGES) return false;

    timestamps.push(now);
    return true;
  };
};

const toAckError = (err) =>
  err instanceof AppError
    ? { ok: false, code: err.code, message: err.message }
    : { ok: false, code: "INTERNAL_ERROR", message: "Mesaj gönderilemedi" };

export const registerMessageHandlers = (socket) => {
  const allowMessage = createRateGuard();

  socket.on("message:send", async (payload, ack) => {
    const respond = typeof ack === "function" ? ack : () => {};

    if (!allowMessage()) {
      return respond({ ok: false, code: "TOO_MANY_REQUESTS", message: "Çok hızlı mesaj gönderiyorsunuz" });
    }

    try {
      const body = parseOrThrow(sendMessageBody, payload);
      const message = await sendMessage({ senderId: socket.data.userId, ...body });
      return respond({ ok: true, message });
    } catch (err) {
      if (!(err instanceof AppError)) {
        logger.error({ err, userId: socket.data.userId }, "Socket mesajı gönderilemedi");
      }
      return respond(toAckError(err));
    }
  });
};
