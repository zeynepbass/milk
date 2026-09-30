import { create } from "zustand";

export const AUTH_STATUS = {
  booting: "booting",
  authenticated: "authenticated",
  anonymous: "anonymous",
};

export const useAuthStore = create((set) => ({
  status: AUTH_STATUS.booting,
  accessToken: null,
  user: null,

  setSession: ({ accessToken, user }) => set({ status: AUTH_STATUS.authenticated, accessToken, user }),

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),

  clearSession: () => set({ status: AUTH_STATUS.anonymous, accessToken: null, user: null }),
}));

export const selectCurrentUserId = (state) => state.user?._id ?? null;
