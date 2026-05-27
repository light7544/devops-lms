"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, MessageSquareText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewQuestion } from "@/lib/content/types";

const DIFFICULTY_CONFIG = {
  junior: { label: "Junior", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  mid: { label: "Mid-level", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  senior: { label: "Senior", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

function AnswerContent({ answer }: { answer: string }) {
  // Render answer text with basic inline formatting
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
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\. /)?.[1];
          return (
            <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-medium text-zinc-400 shrink-0">
                {num}
              </span>
              <span dangerouslySetInnerHTML={{ __html: html.replace(/^\d+\. /, "") }} />
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

export function InterviewQuestions({ questions }: { questions: InterviewQuestion[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const allRevealed = revealed.size === questions.length;

  const toggleAll = () => {
    if (allRevealed) setRevealed(new Set());
    else setRevealed(new Set(questions.map((_, i) => i)));
  };

  return (
    <section className="mt-12 border-t border-zinc-800 pt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
            <MessageSquareText className="h-4.5 w-4.5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Interview Questions</h2>
            <p className="text-xs text-zinc-500">{questions.length} scenario-based questions</p>
          </div>
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all"
        >
          {allRevealed ? (
            <><EyeOff className="h-3.5 w-3.5" /> Hide All</>
          ) : (
            <><Eye className="h-3.5 w-3.5" /> Reveal All</>
          )}
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, i) => {
          const isOpen = revealed.has(i);
          const diff = q.difficulty ? DIFFICULTY_CONFIG[q.difficulty] : null;

          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border transition-all duration-200",
                isOpen
                  ? "border-purple-500/25 bg-purple-500/5"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              )}
            >
              {/* Question row */}
              <div className="flex items-start gap-3 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-zinc-400">
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
                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200 hover:border-zinc-600"
                    )}
                  >
                    {isOpen ? (
                      <><ChevronUp className="h-3.5 w-3.5" /> Hide</>
                    ) : (
                      <><Eye className="h-3.5 w-3.5" /> Reveal</>
                    )}
                  </button>
                </div>
              </div>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 ml-9 border-t border-purple-500/15 pt-3">
                      <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-2">
                        Model Answer
                      </div>
                      <AnswerContent answer={q.answer} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
