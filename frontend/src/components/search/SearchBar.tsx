"use client";

import { useState, useMemo } from "react";
import { Search, X, Clock } from "lucide-react";
import { useDebounce } from "@/hooks";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search startups, founders, industries..." }: Props) {
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("yc-recent-searches");
    return saved ? JSON.parse(saved) : [];
  });

  const saveSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("yc-recent-searches", JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("yc-recent-searches");
  };

  return (
    <div className="relative w-full max-w-2xl font-sans">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
          focused
            ? "border-[#49B6E5] shadow-[5px_5px_0px_0px_#49B6E5] bg-[var(--surface)]"
            : "border-[#263D5B] dark:border-[#49B6E5] bg-[var(--surface)] shadow-[3px_3px_0px_0px_#263D5B] dark:shadow-[3px_3px_0px_0px_#49B6E5]"
        }`}
      >
        <Search className={`w-5 h-5 shrink-0 transition-colors ${focused ? "text-[#49B6E5]" : "text-[#263D5B] dark:text-[#49B6E5]"}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) saveSearch(value.trim());
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent doodle-font text-base text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="p-1 rounded-md hover:bg-[#49B6E5]/20 text-[#263D5B] dark:text-[#49B6E5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#263D5B] dark:text-[#49B6E5] bg-[#49B6E5]/15 px-2 py-0.5 rounded-lg border-2 border-[#263D5B]">
          ⌘K
        </kbd>
      </div>

      {/* Recent searches dropdown */}
      {focused && !value && recentSearches.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl shadow-xl p-2 z-50 overflow-y-auto max-h-60" data-lenis-prevent>
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">Recent</span>
            <button onClick={clearRecent} className="text-[10px] text-[var(--muted)] hover:text-[var(--danger)]">
              Clear
            </button>
          </div>
          {recentSearches.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); saveSearch(s); }}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
            >
              <Clock className="w-3 h-3 text-[var(--muted)]" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
