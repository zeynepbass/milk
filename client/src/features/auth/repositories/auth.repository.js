import { authApi } from "../api/auth.api";

export const authRepository = {
  login: async (credentials) => (await authApi.login(credentials)).data,
  register: async (payload) => (await authApi.register(payload)).data,
};
