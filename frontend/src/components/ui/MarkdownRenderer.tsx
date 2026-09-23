"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split code blocks ```lang ... ``` from text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-3 font-sans text-xs leading-relaxed ${className}`}>
      {parts.map((part, pIdx) => {
        // Fenced Code Block Parsing
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/^```(\w+)?\n?([\s\S]*?)```$/);
          const lang = match?.[1] || "code";
          const codeText = (match?.[2] || part.slice(3, -3)).trim();

          return (
            <div key={pIdx} className="relative my-3 rounded-xl bg-black border border-zinc-800 overflow-hidden font-mono text-[11px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border-b border-zinc-800 text-[10px] text-zinc-400">
                <span>{lang}</span>
                <button
                  onClick={() => handleCopy(codeText, pIdx)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition"
                >
                  {copiedIndex === pIdx ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </span>
                  )}
                </button>
              </div>
              <pre className="p-3 text-emerald-400 overflow-x-auto whitespace-pre">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }

        // Regular Text Formatting (Headers, Bold, Bullet points, Inline Code)
        const lines = part.split("\n");

        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              // Headers
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="font-bold text-sm text-zinc-100 mt-2 mb-1">
                    {parseInlineMarkdown(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="font-bold text-base text-cyan-300 mt-3 mb-1">
                    {parseInlineMarkdown(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={lIdx} className="font-extrabold text-lg text-cyan-400 mt-3 mb-2">
                    {parseInlineMarkdown(trimmed.slice(2))}
                  </h2>
                );
              }

              // Bullet Points (- item or * item or • item)
              if (/^[-*•]\s+/.test(trimmed)) {
                const bulletContent = trimmed.replace(/^[-*•]\s+/, "");
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-purple-400 font-bold text-xs shrink-0 mt-0.5">•</span>
                    <span>{parseInlineMarkdown(bulletContent)}</span>
                  </div>
                );
              }

              // Numbered Lists (1. item, 2. item)
              if (/^\d+\.\s+/.test(trimmed)) {
                const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
                if (match) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-2">
                      <span className="text-cyan-400 font-mono font-bold text-[11px] shrink-0 mt-0.5">
                        {match[1]}.
                      </span>
                      <span>{parseInlineMarkdown(match[2])}</span>
                    </div>
                  );
                }
              }

              // Normal Line
              return (
                <p key={lIdx} className="text-zinc-200 leading-relaxed">
                  {parseInlineMarkdown(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Parses inline markdown: **bold**, *italic*, `inline code`
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  // Regex to split on `inline code` and **bold**
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(regex);

  return parts.map((chunk, idx) => {
    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      return (
        <code key={idx} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-black text-emerald-400 border border-zinc-800">
          {chunk.slice(1, -1)}
        </code>
      );
    }
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-zinc-100">
          {chunk.slice(2, -2)}
        </strong>
      );
    }
    if (chunk.startsWith("*") && chunk.endsWith("*")) {
      return (
        <em key={idx} className="italic text-zinc-300">
          {chunk.slice(1, -1)}
        </em>
      );
    }
    return chunk;
  });
}
