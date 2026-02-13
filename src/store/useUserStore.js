import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (data) =>
        set({
          user: data.user,
          token: data.token
        }),

      logout: () =>
        set({
          user: null,
          token: null
        }),
    }),
    {
      name: "auth-storage"
    }
  )
);
