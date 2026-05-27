"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, Terminal, Info, Lightbulb, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  content: string;
}

// Inline copy button for code blocks
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-0.5 rounded-md hover:bg-zinc-800"
    >
      {copied ? (
        <><Check className="h-3.5 w-3.5 text-green-500" /><span className="text-green-500">Copied!</span></>
      ) : (
        <><Copy className="h-3.5 w-3.5" /><span>Copy</span></>
      )}
    </button>
  );
}

// Parse the markdown content into sections
function parseMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join("\n");
      elements.push(
        <div key={key++} className="group my-4 rounded-xl overflow-hidden border border-zinc-800 bg-[#111113]">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-zinc-600" />
              <span className="text-xs text-zinc-500 font-mono">{lang}</span>
            </div>
            <CopyButton code={code} />
          </div>
          <pre className="overflow-x-auto text-[0.8125rem] leading-[1.7] font-mono" style={{ margin: 0, padding: "1rem 1.25rem", background: "transparent", color: "#d4d4d8" }}>
            {codeLines.length > 6 ? (
              <code>
                {codeLines.map((line, idx) => (
                  <span key={idx} className="table-row">
                    <span className="table-cell pr-4 select-none text-right min-w-[2.5rem]" style={{ color: "#52525b" }}>{idx + 1}</span>
                    <span className="table-cell">{line}</span>
                  </span>
                ))}
              </code>
            ) : (
              <code>{code}</code>
            )}
          </pre>
        </div>
      );
      continue;
    }

    // Blockquote (used for callouts: > **Note:**, > **Tip:**, > **Warning:**)
    if (line.startsWith("> ")) {
      const blockLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        blockLines.push(lines[i].slice(2));
        i++;
      }
      const text = blockLines.join(" ");

      let type: "note" | "tip" | "warning" | "danger" = "note";
      let Icon = Info;
      let color = "text-blue-400";
      let bg = "bg-blue-500/8";
      let border = "border-blue-500/20";

      if (text.includes("**Tip:**") || text.includes("**Pro tip:**")) {
        type = "tip"; Icon = Lightbulb; color = "text-amber-400"; bg = "bg-amber-500/8"; border = "border-amber-500/20";
      } else if (text.includes("**Warning:**")) {
        type = "warning"; Icon = AlertTriangle; color = "text-amber-400"; bg = "bg-amber-500/8"; border = "border-amber-500/20";
      } else if (text.includes("**Danger:**") || text.includes("**DANGER:**")) {
        type = "danger"; Icon = AlertCircle; color = "text-red-400"; bg = "bg-red-500/8"; border = "border-red-500/20";
      }

      const cleanText = text
        .replace(/\*\*(Note|Tip|Pro tip|Warning|Danger|DANGER):\*\*/g, "")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, `<code class="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200 text-xs">$1</code>`)
        .trim();

      elements.push(
        <div key={key++} className={cn("my-4 rounded-lg border p-4 flex gap-3", bg, border)}>
          <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", color)} />
          <p className="text-sm text-zinc-300" dangerouslySetInnerHTML={{ __html: cleanText }} />
        </div>
      );
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0 tracking-tight">
          {formatInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl font-semibold text-white mt-8 mb-3 tracking-tight border-b border-zinc-800/80 pb-2">
          {formatInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold text-zinc-200 mt-6 mb-2">
          {formatInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // H4
    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={key++} className="text-sm font-semibold text-zinc-300 mt-4 mb-1.5 uppercase tracking-wide">
          {formatInline(line.slice(5))}
        </h4>
      );
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const headers = line.split("|").filter(Boolean).map((h) => h.trim());
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(lines[i].split("|").filter(Boolean).map((c) => c.trim()));
        i++;
      }
      elements.push(
        <div key={key++} className="my-6 overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                {headers.map((h, j) => (
                  <th key={j} className="px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wide whitespace-nowrap">
                    <span dangerouslySetInnerHTML={{ __html: inlineFormat(h) }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-zinc-950/50" : "bg-transparent"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-zinc-400 border-b border-zinc-800/50 last:border-b-0">
                      <span dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-3 space-y-1.5 pl-1">
          {listItems.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-zinc-400 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const listItems: string[] = [];
      let n = 1;
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
        n++;
      }
      elements.push(
        <ol key={key++} className="my-3 space-y-1.5 pl-1">
          {listItems.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-zinc-400 text-sm">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-medium text-zinc-400 shrink-0">
                {j + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line === "---" || line === "***") {
      elements.push(<hr key={key++} className="my-6 border-zinc-800" />);
      i++;
      continue;
    }

    // Empty line — skip
    if (!line.trim()) {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-sm text-zinc-400 leading-relaxed my-3">
        <span dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      </p>
    );
    i++;
  }

  return elements;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-zinc-200">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-zinc-300">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 border border-zinc-700/50 px-1.5 py-0.5 rounded text-zinc-200 text-xs font-mono">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function formatInline(text: string): React.ReactNode {
  return <span dangerouslySetInnerHTML={{ __html: inlineFormat(text) }} />;
}

export function LessonContent({ content }: LessonContentProps) {
  return (
    <article className="lesson-content max-w-none">
      {parseMarkdown(content)}
    </article>
  );
}
