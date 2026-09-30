import { create } from "zustand";

export const useSearchStore = create((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
}));
