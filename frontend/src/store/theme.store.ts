"use client";

import { create } from "zustand";

interface ThemeStore {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
  resolved: "light" | "dark";
  load: () => void;
}

function resolveTheme(t: "light" | "dark" | "system"): "light" | "dark" {
  if (t !== "system") return t;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  resolved: "light",
  setTheme: (t) => {
    const resolved = resolveTheme(t);
    if (typeof window !== "undefined") {
      try { localStorage.setItem("yc-theme", t); } catch { /* Storage may be unavailable. */ }
      document.documentElement.setAttribute("data-theme", resolved);
    }
    set({ theme: t, resolved });
  },
  load: () => {
    if (typeof window !== "undefined") {
      let stored: string | null = null;
      try { stored = localStorage.getItem("yc-theme"); } catch { /* Use the default theme. */ }
      const saved = stored === "dark" || stored === "system" ? stored : "light";
      const resolved = resolveTheme(saved);
      document.documentElement.setAttribute("data-theme", resolved);
      set({ theme: saved, resolved });
    }
  },
}));
