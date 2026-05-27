"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  StickyNote,
  CheckSquare,
  MessageSquare,
  Plus,
  Trash2,
  Check,
  Square,
  Pencil,
  Send,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotes } from "@/lib/hooks/useNotes";
import { useTasks } from "@/lib/hooks/useTasks";
import { useComments } from "@/lib/hooks/useComments";
import { useProfile } from "@/lib/hooks/useProfile";

type Tab = "notes" | "tasks" | "comments";

interface NotesPanelProps {
  open: boolean;
  onClose: () => void;
  trackId: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  trackTitle: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={cn(
      "rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold shrink-0",
      size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
    )}>
      {initials}
    </div>
  );
}

export function NotesPanel({ open, onClose, trackId, moduleId, lessonId, lessonTitle, trackTitle }: NotesPanelProps) {
  const [tab, setTab] = useState<Tab>("notes");
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? null;
  const profileName = activeProfile?.name ?? "You";

  const { notes, addNote, updateNote, deleteNote } = useNotes(profileId, trackId, moduleId, lessonId);
  const { tasks, addTask, toggleTask, deleteTask } = useTasks(profileId, { lessonId });
  const { comments, addComment, deleteComment } = useComments(trackId, moduleId, lessonId);

  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Task creation state — title + description
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskFormExpanded, setTaskFormExpanded] = useState(false);

  const [commentText, setCommentText] = useState("");
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);
  const taskTitleRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && tab === "notes") noteTextareaRef.current?.focus();
    if (open && tab === "tasks") taskTitleRef.current?.focus();
    if (open && tab === "comments") commentInputRef.current?.focus();
  }, [open, tab]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(noteText);
    setNoteText("");
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingNote(id);
    setEditText(content);
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) updateNote(id, editText);
    setEditingNote(null);
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    addTask(taskTitle, { description: taskDesc, trackId, moduleId, lessonId, lessonTitle, trackTitle });
    setTaskTitle("");
    setTaskDesc("");
    setTaskFormExpanded(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !profileId) return;
    addComment(commentText, profileId, profileName);
    setCommentText("");
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const doneTasks = tasks.filter((t) => t.completed);

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "notes", label: "Notes", icon: StickyNote, count: notes.length },
    { id: "tasks", label: "Tasks", icon: CheckSquare, count: pendingTasks.length },
    { id: "comments", label: "Comments", icon: MessageSquare, count: comments.length },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div className="min-w-0">
                <h2 className="font-semibold text-zinc-100 text-sm">Lesson Notes</h2>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{lessonTitle}</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors ml-3 shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800 px-1 pt-1">
              {TABS.map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t transition-colors relative",
                    tab === id
                      ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500 after:rounded-full"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {(count ?? 0) > 0 && (
                    <span className={cn(
                      "ml-0.5 px-1.5 py-0.5 text-xs rounded-full",
                      tab === id ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-400"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">

              {/* NOTES TAB */}
              {tab === "notes" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notes.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-zinc-600 text-sm gap-2">
                        <StickyNote className="h-8 w-8 opacity-40" />
                        <span>No notes yet. Add your first note below.</span>
                      </div>
                    )}
                    {notes.map((note) => (
                      <div key={note.id} className="group bg-zinc-800/60 rounded-lg p-3 border border-zinc-700/50">
                        {editingNote === note.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 resize-none focus:outline-none focus:border-blue-500 min-h-[80px]"
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setEditingNote(null)} className="px-3 py-1 text-xs rounded text-zinc-400 hover:text-zinc-200">Cancel</button>
                              <button onClick={() => handleSaveEdit(note.id)} className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white">Save</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-zinc-600">{formatTime(note.updatedAt)}</span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleStartEdit(note.id, note.content)} className="p-1 rounded hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors">
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button onClick={() => deleteNote(note.id)} className="p-1 rounded hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-zinc-800">
                    <textarea
                      ref={noteTextareaRef}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote(); }}
                      placeholder="Write a note… (⌘↵ to save)"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-blue-500 min-h-[80px]"
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      className="mt-2 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Note
                    </button>
                  </div>
                </div>
              )}

              {/* TASKS TAB */}
              {tab === "tasks" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-zinc-600 text-sm gap-2">
                        <CheckSquare className="h-8 w-8 opacity-40" />
                        <span>No tasks yet. Add one below.</span>
                      </div>
                    )}

                    {/* Pending tasks */}
                    {pendingTasks.length > 0 && (
                      <div className="space-y-2">
                        {pendingTasks.map((task) => (
                          <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                        ))}
                      </div>
                    )}

                    {/* Completed tasks */}
                    {doneTasks.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-700 mb-2 mt-2">Completed</p>
                        <div className="space-y-2">
                          {doneTasks.map((task) => (
                            <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Task creation form */}
                  <div className="p-4 border-t border-zinc-800 space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={taskTitleRef}
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleAddTask(); }}
                        placeholder="Task title…"
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => setTaskFormExpanded((v) => !v)}
                        title="Add description"
                        className={cn(
                          "px-2.5 rounded-lg border transition-colors shrink-0",
                          taskFormExpanded
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        <ChevronDown className={cn("h-4 w-4 transition-transform", taskFormExpanded && "rotate-180")} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {taskFormExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          <textarea
                            value={taskDesc}
                            onChange={(e) => setTaskDesc(e.target.value)}
                            placeholder="Description (optional)…"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-blue-500 min-h-[70px]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handleAddTask}
                      disabled={!taskTitle.trim()}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>
                </div>
              )}

              {/* COMMENTS TAB */}
              {tab === "comments" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-zinc-600 text-sm gap-2">
                        <MessageSquare className="h-8 w-8 opacity-40" />
                        <span>No comments yet. Start the discussion!</span>
                      </div>
                    )}
                    {comments.map((comment) => (
                      <div key={comment.id} className="group flex gap-3">
                        <Avatar name={comment.profileName} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-200">{comment.profileName}</span>
                              <span className="text-xs text-zinc-600">{formatTime(comment.createdAt)}</span>
                            </div>
                            {comment.profileId === profileId && (
                              <button
                                onClick={() => deleteComment(comment.id, profileId!)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-all shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mt-1 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-zinc-800">
                    {activeProfile ? (
                      <div className="flex gap-3">
                        <Avatar name={profileName} />
                        <div className="flex-1 space-y-2">
                          <textarea
                            ref={commentInputRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddComment(); }}
                            placeholder="Write a comment… (⌘↵ to post)"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-blue-500 min-h-[70px]"
                          />
                          <button
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm transition-colors"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Post
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 text-center">Select a profile to comment.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: import("@/lib/hooks/useTasks").Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className={cn(
      "group flex items-start gap-3 rounded-lg p-3 border transition-colors",
      task.completed
        ? "bg-zinc-900/40 border-zinc-800/50"
        : "bg-zinc-800/60 border-zinc-700/50"
    )}>
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-0.5 shrink-0 transition-colors",
          task.completed ? "text-green-400" : "text-zinc-600 hover:text-zinc-400"
        )}
      >
        {task.completed ? <Check className="h-4 w-4" /> : <Square className="h-4 w-4" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm leading-snug", task.completed ? "line-through text-zinc-600" : "text-zinc-300")}>
          {task.title}
        </p>
        {task.description && (
          <p className={cn("text-xs mt-0.5 leading-relaxed", task.completed ? "text-zinc-700" : "text-zinc-500")}>
            {task.description}
          </p>
        )}
        <span className="text-[10px] text-zinc-700 mt-1 block">{new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-900/30 text-zinc-600 hover:text-red-400 transition-all shrink-0 mt-0.5"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
