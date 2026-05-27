"use client";

import { useState, useEffect, useCallback } from "react";

export interface Comment {
  id: string;
  lessonId: string;
  moduleId: string;
  trackId: string;
  profileId: string;
  profileName: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = "devops-lms:comments";

function loadAll(): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAll(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

export function useComments(trackId: string, moduleId: string, lessonId: string) {
  const [comments, setComments] = useState<Comment[]>([]);

  const refresh = useCallback(() => {
    const all = loadAll();
    setComments(all.filter((c) => c.trackId === trackId && c.moduleId === moduleId && c.lessonId === lessonId));
  }, [trackId, moduleId, lessonId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addComment = useCallback(
    (content: string, profileId: string, profileName: string) => {
      if (!content.trim()) return;
      const all = loadAll();
      const comment: Comment = {
        id: crypto.randomUUID(),
        lessonId,
        moduleId,
        trackId,
        profileId,
        profileName,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      saveAll([...all, comment]);
      refresh();
    },
    [trackId, moduleId, lessonId, refresh]
  );

  const deleteComment = useCallback(
    (id: string, profileId: string) => {
      const all = loadAll();
      const updated = all.filter((c) => !(c.id === id && c.profileId === profileId));
      saveAll(updated);
      refresh();
    },
    [refresh]
  );

  return { comments, addComment, deleteComment };
}
