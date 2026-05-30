import { useEffect, useState, useCallback } from "react";

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

const STORAGE_KEY = "lovable-notes-v1";

function load(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = load();
    setNotes(initial);
    setActiveId(initial[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, hydrated]);

  const createNote = useCallback(() => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
    return note;
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<Pick<Note, "title" | "content">>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      setActiveId((curr) => (curr === id ? next[0]?.id ?? null : curr));
      return next;
    });
  }, []);

  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  const active = notes.find((n) => n.id === activeId) ?? null;

  return { notes: sorted, active, activeId, setActiveId, createNote, updateNote, deleteNote };
}
