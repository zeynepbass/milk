import { endSession, startSession } from "@/shared/api/session";
import { authRepository } from "../repositories/auth.repository";

export const authService = {
  async login(credentials) {
    const session = await authRepository.login(credentials);
    startSession(session);
    return session;
  },

  register: (payload) => authRepository.register(payload),

  logout: () => endSession(),
};
