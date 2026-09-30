import axios from "axios";
import { API_BASE_URL } from "@/shared/config/env";
import { useAuthStore } from "@/shared/store/useAuthStore";

const REFRESH_LOCK = "milk-session-refresh";
const RACE_RETRY_DELAY_MS = 150;

const sessionClient = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withCrossTabLock = (task) =>
  typeof navigator !== "undefined" && navigator.locks?.request
    ? navigator.locks.request(REFRESH_LOCK, task)
    : task();

const requestRefresh = async (attempt = 0) => {
  try {
    const { data } = await sessionClient.post("/auth/refresh");
    return data;
  } catch (error) {
    if (error.response?.data?.code === "REFRESH_RACE" && attempt === 0) {
      await wait(RACE_RETRY_DELAY_MS);
      return requestRefresh(attempt + 1);
    }
    throw error;
  }
};

let inflightRefresh = null;

export const refreshSession = () => {
  inflightRefresh ??= withCrossTabLock(requestRefresh)
    .then((data) => {
      useAuthStore.getState().setSession(data);
      return data.accessToken;
    })
    .catch((error) => {
      useAuthStore.getState().clearSession();
      throw error;
    })
    .finally(() => {
      inflightRefresh = null;
    });

  return inflightRefresh;
};

export const endSession = async () => {
  try {
    await sessionClient.post("/auth/logout");
  } finally {
    useAuthStore.getState().clearSession();
  }
};
