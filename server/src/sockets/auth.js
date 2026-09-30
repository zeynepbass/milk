import { authenticateAccessToken } from "../services/auth.service.js";

const toConnectError = (err) => {
  const error = new Error(err?.message ?? "Yetkisiz bağlantı");
  error.data = { code: err?.code ?? "UNAUTHORIZED" };
  return error;
};

export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || token.length === 0) {
      return next(toConnectError({ message: "Oturum açmanız gerekiyor", code: "TOKEN_MISSING" }));
    }

    const user = await authenticateAccessToken(token);
    socket.data.userId = user.id;
    socket.data.tokenExpiresAt = user.exp * 1000;
    return next();
  } catch (err) {
    return next(toConnectError(err));
  }
};

export const scheduleExpiryDisconnect = (socket) => {
  const remaining = socket.data.tokenExpiresAt - Date.now();
  const timer = setTimeout(() => socket.disconnect(true), Math.max(remaining, 0));
  timer.unref?.();
  socket.once("disconnect", () => clearTimeout(timer));
};
