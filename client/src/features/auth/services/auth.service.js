import { useAuthStore } from "@/shared/store/useAuthStore";
import { endSession } from "@/shared/api/session";
import { authRepository } from "../repositories/auth.repository";

export const authService = {
  async login(credentials) {
    const session = await authRepository.login(credentials);
    useAuthStore.getState().setSession(session);
    return session;
  },

  register(payload) {
    return authRepository.register(payload);
  },

  logout() {
    return endSession();
  },
};
