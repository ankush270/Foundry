"use client";

import { create } from "zustand";

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
      if (typeof window !== "undefined") localStorage.setItem("yc-watchlist", JSON.stringify(next));
      return { ids: next };
    }),
  isWatched: (id) => get().ids.includes(id),
  load: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("yc-watchlist");
      if (saved) set({ ids: JSON.parse(saved) });
    }
  },
}));
