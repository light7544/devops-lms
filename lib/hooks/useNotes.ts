"use client";

import { useState, useEffect, useCallback } from "react";

export interface Note {
  id: string;
  lessonId: string;
  moduleId: string;
  trackId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = (profileId: string) => `devops-lms:notes:${profileId}`;

function loadNotes(profileId: string): Note[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(profileId)) ?? "[]");
  } catch {
    return [];
  }
}

function saveNotes(profileId: string, notes: Note[]) {
  localStorage.setItem(STORAGE_KEY(profileId), JSON.stringify(notes));
}

export function useNotes(profileId: string | null, trackId: string, moduleId: string, lessonId: string) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!profileId) return;
    const all = loadNotes(profileId);
    setNotes(all.filter((n) => n.trackId === trackId && n.moduleId === moduleId && n.lessonId === lessonId));
  }, [profileId, trackId, moduleId, lessonId]);

  const addNote = useCallback(
    (content: string) => {
      if (!profileId || !content.trim()) return;
      const all = loadNotes(profileId);
      const note: Note = {
        id: crypto.randomUUID(),
        lessonId,
        moduleId,
        trackId,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [...all, note];
      saveNotes(profileId, updated);
      setNotes(updated.filter((n) => n.trackId === trackId && n.moduleId === moduleId && n.lessonId === lessonId));
    },
    [profileId, trackId, moduleId, lessonId]
  );

  const updateNote = useCallback(
    (id: string, content: string) => {
      if (!profileId) return;
      const all = loadNotes(profileId);
      const updated = all.map((n) => (n.id === id ? { ...n, content: content.trim(), updatedAt: new Date().toISOString() } : n));
      saveNotes(profileId, updated);
      setNotes(updated.filter((n) => n.trackId === trackId && n.moduleId === moduleId && n.lessonId === lessonId));
    },
    [profileId, trackId, moduleId, lessonId]
  );

  const deleteNote = useCallback(
    (id: string) => {
      if (!profileId) return;
      const all = loadNotes(profileId);
      const updated = all.filter((n) => n.id !== id);
      saveNotes(profileId, updated);
      setNotes(updated.filter((n) => n.trackId === trackId && n.moduleId === moduleId && n.lessonId === lessonId));
    },
    [profileId, trackId, moduleId, lessonId]
  );

  return { notes, addNote, updateNote, deleteNote };
}
