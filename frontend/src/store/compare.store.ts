"use client";

import { create } from "zustand";
import type { Startup } from "@/data/types";

interface CompareStore {
  selected: Startup[];
  add: (s: Startup) => void;
  remove: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  selected: [],
  add: (s) =>
    set((state) => {
      if (state.selected.length >= 3 || state.selected.find((x) => x.id === s.id)) return state;
      return { selected: [...state.selected, s] };
    }),
  remove: (id) => set((state) => ({ selected: state.selected.filter((s) => s.id !== id) })),
  clear: () => set({ selected: [] }),
  isSelected: (id) => get().selected.some((s) => s.id === id),
}));
