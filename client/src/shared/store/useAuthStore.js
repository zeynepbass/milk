import { create } from "zustand";

export const AUTH_STATUS = {
  booting: "booting",
  authenticated: "authenticated",
  anonymous: "anonymous",
};

export const useAuthStore = create((set) => ({
  status: AUTH_STATUS.booting,
  accessToken: null,
  userId: null,

  setSession: ({ accessToken, user }) =>
    set({ status: AUTH_STATUS.authenticated, accessToken, userId: user?._id ?? null }),

  clearSession: () => set({ status: AUTH_STATUS.anonymous, accessToken: null, userId: null }),
}));
