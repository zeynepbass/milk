import axios from "axios";
import { API_BASE_URL } from "@/shared/config/env";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { queryClient } from "@/shared/query/queryClient";
import { queryKeys } from "@/shared/query/queryKeys";

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

export const startSession = (session) => {
  queryClient.setQueryData(queryKeys.me, session.user);
  useAuthStore.getState().setSession(session);
};

export const clearLocalSession = () => {
  useAuthStore.getState().clearSession();
  queryClient.clear();
};

let inflightRefresh = null;

export const refreshSession = () => {
  inflightRefresh ??= withCrossTabLock(requestRefresh)
    .then((data) => {
      startSession(data);
      return data.accessToken;
    })
    .catch((error) => {
      clearLocalSession();
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
    clearLocalSession();
  }
};
