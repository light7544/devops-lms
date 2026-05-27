"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = "bash", filename, showLineNumbers }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const trimmed = code.trim();
  const lines = trimmed.split("\n");
  const numbered = showLineNumbers ?? lines.length > 5;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-xl overflow-hidden border border-zinc-800 bg-[#111113] my-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs text-zinc-500 font-mono">{filename || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-0.5 rounded-md hover:bg-zinc-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre
        className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed font-mono"
        style={{ background: "transparent", color: "#d4d4d8" }}
      >
        {numbered ? (
          <code>
            {lines.map((line, i) => (
              <span key={i} className="table-row">
                <span className="table-cell pr-4 select-none text-right min-w-[2rem]" style={{ color: "#52525b" }}>
                  {i + 1}
                </span>
                <span className="table-cell">{line}</span>
              </span>
            ))}
          </code>
        ) : (
          <code>{trimmed}</code>
        )}
      </pre>
    </div>
  );
}
