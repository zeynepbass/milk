import axios from "axios";
import { API_BASE_URL } from "@/shared/config/env";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { refreshSession } from "./session";

const RECOVERABLE_CODES = new Set(["TOKEN_EXPIRED", "TOKEN_INVALID", "TOKEN_STALE", "TOKEN_MISSING"]);
const SESSION_ENDING_CODES = new Set(["ACCOUNT_FROZEN"]);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const code = response?.data?.code;

    if (response?.status !== 401 || !config) {
      return Promise.reject(error);
    }

    if (SESSION_ENDING_CODES.has(code)) {
      useAuthStore.getState().clearSession();
      return Promise.reject(error);
    }

    if (config.retriedAfterRefresh || !RECOVERABLE_CODES.has(code)) {
      return Promise.reject(error);
    }

    const accessToken = await refreshSession();
    config.retriedAfterRefresh = true;
    config.headers.Authorization = `Bearer ${accessToken}`;

    return apiClient(config);
  }
);

export const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

export default apiClient;
