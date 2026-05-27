"use client";

import { useState, useEffect, useCallback } from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  trackId?: string;
  moduleId?: string;
  lessonId?: string;
  lessonTitle?: string;
  trackTitle?: string;
  createdAt: string;
}

const STORAGE_KEY = (profileId: string) => `devops-lms:tasks:${profileId}`;

function loadTasks(profileId: string): Task[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(profileId)) ?? "[]");
  } catch {
    return [];
  }
}

function saveTasks(profileId: string, tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY(profileId), JSON.stringify(tasks));
}

export function useTasks(profileId: string | null, options?: { trackId?: string; moduleId?: string; lessonId?: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const refresh = useCallback(() => {
    if (!profileId) return;
    const all = loadTasks(profileId);
    if (options?.lessonId) {
      setTasks(all.filter((t) => t.lessonId === options.lessonId));
    } else if (options?.trackId) {
      setTasks(all.filter((t) => t.trackId === options.trackId));
    } else {
      setTasks(all);
    }
  }, [profileId, options?.trackId, options?.moduleId, options?.lessonId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = useCallback(
    (
      title: string,
      context?: {
        description?: string;
        trackId?: string;
        moduleId?: string;
        lessonId?: string;
        lessonTitle?: string;
        trackTitle?: string;
      }
    ) => {
      if (!profileId || !title.trim()) return;
      const all = loadTasks(profileId);
      const { description, ...rest } = context ?? {};
      const task: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description?.trim() || undefined,
        completed: false,
        createdAt: new Date().toISOString(),
        ...rest,
      };
      const updated = [...all, task];
      saveTasks(profileId, updated);
      refresh();
    },
    [profileId, refresh]
  );

  const toggleTask = useCallback(
    (id: string) => {
      if (!profileId) return;
      const all = loadTasks(profileId);
      const updated = all.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      saveTasks(profileId, updated);
      refresh();
    },
    [profileId, refresh]
  );

  const deleteTask = useCallback(
    (id: string) => {
      if (!profileId) return;
      const all = loadTasks(profileId);
      const updated = all.filter((t) => t.id !== id);
      saveTasks(profileId, updated);
      refresh();
    },
    [profileId, refresh]
  );

  return { tasks, addTask, toggleTask, deleteTask };
}
