"use client";

import { create } from "zustand";
import type { Note } from "@/data/types";
import { readStored, writeStored } from "@/lib/browser-storage";

interface NotesStore {
  notes: Note[];
  addNote: (startupId: string, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForStartup: (startupId: string) => Note[];
  load: () => void;
}

const persist = (notes: Note[]) => {
  writeStored("yc-notes", notes);
};

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  addNote: (startupId, content) =>
    set((state) => {
      const note: Note = {
        id: crypto.randomUUID(),
        startupId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const next = [...state.notes, note];
      persist(next);
      return { notes: next };
    }),
  updateNote: (id, content) =>
    set((state) => {
      const next = state.notes.map((n) =>
        n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
      );
      persist(next);
      return { notes: next };
    }),
  deleteNote: (id) =>
    set((state) => {
      const next = state.notes.filter((n) => n.id !== id);
      persist(next);
      return { notes: next };
    }),
  getNotesForStartup: (startupId) => get().notes.filter((n) => n.startupId === startupId),
  load: () => {
    if (typeof window !== "undefined") {
      const notes = readStored("yc-notes", (value): value is Note[] => Array.isArray(value) && value.every((note) =>
        note && ["id", "startupId", "content", "createdAt", "updatedAt"].every((key) => typeof note[key] === "string")
      ), []);
      set({ notes });
    }
  },
}));
