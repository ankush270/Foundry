"use client";

import { create } from "zustand";
import { readStored, writeStored } from "@/lib/browser-storage";

interface WatchlistStore {
  ids: string[];
  toggle: (id: string) => void;
  isWatched: (id: string) => boolean;
  load: () => void;
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  ids: [],
  toggle: (id) =>
    set((state) => {
      const next = state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id];
      writeStored("yc-watchlist", next);
      return { ids: next };
    }),
  isWatched: (id) => get().ids.includes(id),
  load: () => {
    if (typeof window !== "undefined") {
      const ids = readStored("yc-watchlist", (value): value is string[] => Array.isArray(value) && value.every((id) => typeof id === "string"), []);
      set({ ids });
    }
  },
}));
