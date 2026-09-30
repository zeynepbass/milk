import { useEffect } from "react";
import { refreshSession } from "@/shared/api/session";
import { hasSessionHint } from "@/shared/api/sessionHint";
import { useAuthStore } from "@/shared/store/useAuthStore";

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

    if (!hasSessionHint()) {
      useAuthStore.getState().clearSession();
      return;
    }

    refreshSession().catch(() => undefined);
  }, []);
}
