import { markConversationRead, sendMessage } from "../services/message.service.js";
import { parseOrThrow } from "../middleware/validate.js";
import { conversationReadBody, sendMessageBody } from "../validators/message.validators.js";
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
    : { ok: false, code: "INTERNAL_ERROR", message: "İşlem tamamlanamadı" };

const handleWithAck = (socket, event, work) => {
  socket.on(event, async (payload, ack) => {
    const respond = typeof ack === "function" ? ack : () => {};

    try {
      respond({ ok: true, ...(await work(payload)) });
    } catch (err) {
      if (!(err instanceof AppError)) {
        logger.error({ err, userId: socket.data.userId, event }, "Socket olayı işlenemedi");
      }
      respond(toAckError(err));
    }
  });
};

export const registerMessageHandlers = (socket) => {
  const allowMessage = createRateGuard();

  handleWithAck(socket, "message:send", async (payload) => {
    if (!allowMessage()) {
      throw new AppError(429, "TOO_MANY_REQUESTS", "Çok hızlı mesaj gönderiyorsunuz");
    }

    const body = parseOrThrow(sendMessageBody, payload);
    return { message: await sendMessage({ senderId: socket.data.userId, ...body }) };
  });

  handleWithAck(socket, "conversation:read", async (payload) => {
    const { conversationId } = parseOrThrow(conversationReadBody, payload);
    return markConversationRead(socket.data.userId, conversationId);
  });
};
