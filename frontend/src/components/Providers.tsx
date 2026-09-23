"use client";

import { useEffect } from "react";
import { useThemeStore, useWatchlistStore, useNotesStore, useQuizStore } from "@/store";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const loadTheme = useThemeStore((s) => s.load);
  const loadWatchlist = useWatchlistStore((s) => s.load);
  const loadNotes = useNotesStore((s) => s.load);
  const loadQuiz = useQuizStore((s) => s.load);

  useEffect(() => {
    loadTheme();
    loadWatchlist();
    loadNotes();
    loadQuiz();
  }, [loadTheme, loadWatchlist, loadNotes, loadQuiz]);

  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
