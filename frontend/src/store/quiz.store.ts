"use client";

import { create } from "zustand";
import { readStored, writeStored } from "@/lib/browser-storage";

interface QuizStore {
  totalCorrect: number;
  totalAttempts: number;
  streak: number;
  bestStreak: number;
  addResult: (correct: boolean) => void;
  load: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  totalCorrect: 0,
  totalAttempts: 0,
  streak: 0,
  bestStreak: 0,
  addResult: (correct) =>
    set((state) => {
      const next = {
        totalCorrect: state.totalCorrect + (correct ? 1 : 0),
        totalAttempts: state.totalAttempts + 1,
        streak: correct ? state.streak + 1 : 0,
        bestStreak: correct ? Math.max(state.bestStreak, state.streak + 1) : state.bestStreak,
      };
      writeStored("yc-quiz", next);
      return next;
    }),
  load: () => {
    if (typeof window !== "undefined") {
      type Stats = Pick<QuizStore, "totalCorrect" | "totalAttempts" | "streak" | "bestStreak">;
      const saved = readStored("yc-quiz", (value): value is Stats => {
        if (!value || typeof value !== "object") return false;
        const stats = value as Stats;
        return [stats.totalCorrect, stats.totalAttempts, stats.streak, stats.bestStreak].every((n) => Number.isSafeInteger(n) && n >= 0)
          && stats.totalCorrect <= stats.totalAttempts && stats.streak <= stats.bestStreak && stats.bestStreak <= stats.totalCorrect;
      }, { totalCorrect: 0, totalAttempts: 0, streak: 0, bestStreak: 0 });
      set({ totalCorrect: saved.totalCorrect, totalAttempts: saved.totalAttempts, streak: saved.streak, bestStreak: saved.bestStreak });
    }
  },
}));
