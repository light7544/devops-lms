"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Brain,
  RotateCcw,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getModule } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { ModuleExamQuestion, InterviewQuestion } from "@/lib/content/types";

const DIFFICULTY_CONFIG = {
  junior: { label: "Junior", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  mid: { label: "Mid-level", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  senior: { label: "Senior", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

function AnswerContent({ answer }: { answer: string }) {
  const lines = answer.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return null;
        const html = line
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-zinc-200 font-semibold">$1</strong>')
          .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 border border-zinc-700/50 px-1.5 py-0.5 rounded text-orange-300 text-xs font-mono">$1</code>');
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: html.slice(2) }} />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-zinc-400 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </p>
        );
      })}
    </div>
  );
}

export default function ModuleExamPage() {
  const params = useParams<{ trackId: string; moduleId: string }>();
  const ctx = getModule(params.trackId, params.moduleId);
  if (!ctx) return notFound();

  const { track, module } = ctx;

  // Gather exam questions: use module.exam if defined, otherwise collect from lessons
  const examQuestions = useMemo((): ModuleExamQuestion[] => {
    if (module.exam && module.exam.length > 0) {
      return module.exam.slice(0, 10);
    }
    // Auto-generate from lesson interviewQuestions
    const all: InterviewQuestion[] = [];
    for (const lesson of module.lessons) {
      if (lesson.interviewQuestions) {
        all.push(...lesson.interviewQuestions);
      }
    }
    // Shuffle deterministically and pick 10
    const shuffled = all.sort((a, b) =>
      a.question.charCodeAt(0) - b.question.charCodeAt(0)
    );
    return shuffled.slice(0, 10);
  }, [module]);

  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [score, setScore] = useState<Record<number, "got-it" | "review">>({});
  const [mode, setMode] = useState<"exam" | "results">("exam");

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const revealAll = () => setRevealed(new Set(examQuestions.map((_, i) => i)));
  const allRevealed = revealed.size === examQuestions.length;

  const markGotIt = (i: number) => setScore((prev) => ({ ...prev, [i]: "got-it" }));
  const markReview = (i: number) => setScore((prev) => ({ ...prev, [i]: "review" }));

  const gotItCount = Object.values(score).filter((v) => v === "got-it").length;
  const reviewCount = Object.values(score).filter((v) => v === "review").length;
  const answeredCount = Object.keys(score).length;
  const progressPercent = examQuestions.length > 0 ? Math.round((answeredCount / examQuestions.length) * 100) : 0;

  const reset = () => {
    setRevealed(new Set());
    setScore({});
    setMode("exam");
  };

  if (examQuestions.length === 0) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Brain className="h-12 w-12 text-zinc-700" />
          <p className="text-zinc-500 text-sm">No exam questions available for this module yet.</p>
          <Button variant="secondary" asChild>
            <Link href={`/tracks/${track.id}`}>
              <ArrowLeft className="h-4 w-4" /> Back to Track
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-full">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
          <div className="px-6 py-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-2">
              <Link href="/" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/tracks/${track.id}`} className="hover:text-zinc-400 transition-colors">
                {track.title}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-500">{module.title}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-amber-400 font-medium">Module Exam</span>
            </div>
            <Progress value={progressPercent} color={track.color} className="h-0.5" />
          </div>
        </div>

        <div className="px-8 py-8 max-w-3xl">
          {/* Exam header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${track.color}20`, border: `1.5px solid ${track.color}40` }}
              >
                <Trophy className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" className="gap-1 bg-amber-500/10 text-amber-400 border-amber-500/20">
                    <Trophy className="h-3 w-3" />
                    Module Exam
                  </Badge>
                  <Badge variant="default">{examQuestions.length} Questions</Badge>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">{module.title}</h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Scenario-based questions to test your understanding. Reveal each answer after attempting it, then mark whether you got it or need to review.
                </p>
              </div>
            </div>

            {/* Score summary */}
            {answeredCount > 0 && (
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-zinc-400">Got it: <strong className="text-green-400">{gotItCount}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-zinc-400">Review: <strong className="text-amber-400">{reviewCount}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm ml-auto">
                  <span className="text-zinc-500 text-xs">{answeredCount}/{examQuestions.length} answered</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={allRevealed ? () => setRevealed(new Set()) : revealAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all"
              >
                {allRevealed ? <><EyeOff className="h-3.5 w-3.5" /> Hide All</> : <><Eye className="h-3.5 w-3.5" /> Reveal All</>}
              </button>
              {answeredCount > 0 && (
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              )}
            </div>
          </motion.div>

          {/* Questions */}
          <div className="space-y-4">
            {examQuestions.map((q, i) => {
              const isOpen = revealed.has(i);
              const diff = q.difficulty ? DIFFICULTY_CONFIG[q.difficulty] : null;
              const marked = score[i];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "rounded-xl border transition-all duration-200",
                    marked === "got-it"
                      ? "border-green-500/30 bg-green-500/5"
                      : marked === "review"
                      ? "border-amber-500/30 bg-amber-500/5"
                      : isOpen
                      ? "border-blue-500/25 bg-blue-500/5"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-start gap-3 p-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-400">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-sm font-medium text-zinc-200 leading-relaxed pt-0.5">
                      {q.question}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {diff && (
                        <span className={cn("hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border", diff.bg, diff.color)}>
                          {diff.label}
                        </span>
                      )}
                      <button
                        onClick={() => toggle(i)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          isOpen
                            ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200 hover:border-zinc-600"
                        )}
                      >
                        {isOpen ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Reveal</>}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 ml-10 border-t border-blue-500/15 pt-3">
                          <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-2">
                            Model Answer
                          </div>
                          <AnswerContent answer={q.answer} />

                          {/* Self-assessment buttons */}
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800/60">
                            <p className="text-[11px] text-zinc-600 mr-auto">How did you do?</p>
                            <button
                              onClick={() => markReview(i)}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                marked === "review"
                                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                  : "text-zinc-500 border-zinc-700 hover:text-amber-400 hover:border-amber-500/30"
                              )}
                            >
                              Need Review
                            </button>
                            <button
                              onClick={() => markGotIt(i)}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                marked === "got-it"
                                  ? "bg-green-500/15 text-green-300 border-green-500/30"
                                  : "text-zinc-500 border-zinc-700 hover:text-green-400 hover:border-green-500/30"
                              )}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Got It!
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Final score card */}
          {answeredCount === examQuestions.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center"
            >
              <Trophy className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Exam Complete!</h3>
              <p className="text-sm text-zinc-400 mb-4">
                <strong className="text-green-400">{gotItCount}</strong> correct ·{" "}
                <strong className="text-amber-400">{reviewCount}</strong> to review
                {" "}· Score: <strong className="text-white">{Math.round((gotItCount / examQuestions.length) * 100)}%</strong>
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="secondary" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Retry Exam
                </Button>
                <Button asChild>
                  <Link href={`/tracks/${track.id}`}>
                    <BookOpen className="h-4 w-4" /> Back to Track
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Nav back */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <Link
              href={`/tracks/${track.id}`}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to {track.title}
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
