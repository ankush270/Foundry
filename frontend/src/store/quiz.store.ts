"use client";

import { create } from "zustand";

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
      if (typeof window !== "undefined") localStorage.setItem("yc-quiz", JSON.stringify(next));
      return next;
    }),
  load: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("yc-quiz");
      if (saved) set(JSON.parse(saved));
    }
  },
}));
