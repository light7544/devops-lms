"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(content: string): Heading[] {
  const lines = content.split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);

    if (h2) {
      const text = h2[1].replace(/\*\*/g, "").trim();
      headings.push({ id: slugify(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/\*\*/g, "").trim();
      headings.push({ id: slugify(text), text, level: 3 });
    }
  }

  return headings;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;
    setActiveId(headings[0]?.id ?? "");
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-20">
      <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={() => setActiveId(heading.id)}
              className={cn(
                "block text-xs leading-relaxed py-0.5 transition-colors",
                heading.level === 3 && "pl-3",
                activeId === heading.id
                  ? "text-zinc-200 font-medium"
                  : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
