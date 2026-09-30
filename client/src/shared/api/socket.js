import { SERVER_URL } from "@/shared/config/env";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";
import { refreshSession } from "./session";

const TOKEN_ERRORS = new Set(["TOKEN_EXPIRED", "TOKEN_INVALID", "TOKEN_STALE", "TOKEN_MISSING"]);
const MAX_TOKEN_RETRIES = 2;

export const createAuthenticatedSocket = async () => {
  const { io } = await import("socket.io-client");
  let tokenRetries = 0;

  const socket = io(SERVER_URL, {
    withCredentials: true,
    autoConnect: false,
    auth: (callback) => callback({ token: useAuthStore.getState().accessToken }),
  });

  const reconnectWithFreshToken = async () => {
    if (tokenRetries >= MAX_TOKEN_RETRIES) return;
    tokenRetries += 1;

    try {
      await refreshSession();
      socket.connect();
    } catch {
      socket.disconnect();
    }
  };

  socket.on("connect", () => {
    tokenRetries = 0;
  });

  socket.on("connect_error", (error) => {
    if (TOKEN_ERRORS.has(error?.data?.code)) {
      reconnectWithFreshToken();
    }
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect" && useAuthStore.getState().status === AUTH_STATUS.authenticated) {
      reconnectWithFreshToken();
    }
  });

  socket.connect();
  return socket;
};
