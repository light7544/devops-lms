"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Clock, GitBranch, Workflow, Code2, Container } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { tracks } from "@/lib/content";

const TRACK_ICONS: Record<string, React.ElementType> = {
  git: GitBranch,
  "github-actions": Workflow,
  python: Code2,
  docker: Container,
};

const TRACK_COLORS: Record<string, string> = {
  git: "#f05033",
  "github-actions": "#2088ff",
  python: "#3776ab",
  docker: "#2496ed",
};

interface SearchResult {
  type: "lesson";
  trackId: string;
  trackTitle: string;
  moduleId: string;
  lessonId: string;
  title: string;
  excerpt: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const router = useRouter();

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const found: SearchResult[] = [];

    for (const track of tracks) {
      for (const module of track.modules) {
        for (const lesson of module.lessons) {
          const titleMatch = lesson.title.toLowerCase().includes(lower);
          const descMatch = lesson.description.toLowerCase().includes(lower);
          const contentMatch = lesson.content.toLowerCase().includes(lower);

          if (titleMatch || descMatch || contentMatch) {
            const idx = lesson.content.toLowerCase().indexOf(lower);
            const excerpt =
              idx >= 0
                ? lesson.content.slice(Math.max(0, idx - 40), idx + 80).replace(/[#*`]/g, "").trim() + "…"
                : lesson.description;

            found.push({
              type: "lesson",
              trackId: track.id,
              trackTitle: track.title,
              moduleId: module.id,
              lessonId: lesson.id,
              title: lesson.title,
              excerpt,
            });
          }
        }
      }
    }
    setResults(found.slice(0, 8));
    setSelectedIdx(0);
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const navigate = (result: SearchResult) => {
    router.push(`/tracks/${result.trackId}/${result.moduleId}/${result.lessonId}`);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      navigate(results[selectedIdx]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons, topics, commands…"
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-zinc-500 hover:text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-flex text-xs text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-800 font-mono">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {!query && (
            <div className="px-4 py-8 text-center">
              <Search className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Search across all tracks and lessons</p>
              <p className="text-xs text-zinc-600 mt-1">
                Try: "git rebase", "docker compose", "CI pipeline"
              </p>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-zinc-500">No results for "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {results.map((result, idx) => {
                const Icon = TRACK_ICONS[result.trackId] || FileText;
                const color = TRACK_COLORS[result.trackId] || "#6366f1";
                return (
                  <button
                    key={`${result.trackId}-${result.moduleId}-${result.lessonId}`}
                    onClick={() => navigate(result)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-3 ${
                      idx === selectedIdx ? "bg-zinc-800" : "hover:bg-zinc-800/60"
                    }`}
                  >
                    <div
                      className="mt-0.5 h-6 w-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-zinc-100 truncate">
                          {result.title}
                        </span>
                        <span
                          className="text-xs shrink-0 px-1.5 py-0.5 rounded"
                          style={{ background: `${color}15`, color }}
                        >
                          {result.trackTitle}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{result.excerpt}</p>
                    </div>
                    <Clock className="h-3.5 w-3.5 text-zinc-700 shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <kbd className="px-1 rounded border border-zinc-800 font-mono">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 rounded border border-zinc-800 font-mono">↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 rounded border border-zinc-800 font-mono">esc</kbd> close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
