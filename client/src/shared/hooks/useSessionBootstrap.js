import { useEffect } from "react";
import { refreshSession } from "@/shared/api/session";

const LEGACY_TOKEN_STORAGE_KEY = "auth-storage";

const removeLegacyToken = () => {
  try {
    localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
  } catch {
    return;
  }
};

export function useSessionBootstrap() {
  useEffect(() => {
    removeLegacyToken();
    refreshSession().catch(() => undefined);
  }, []);
}
