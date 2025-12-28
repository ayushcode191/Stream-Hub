import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("stremify-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    set({ theme });
  },
}));