"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Building2, Rocket, Code2, ArrowRight, Zap, TrendingUp } from "lucide-react";
import { startups } from "@/data/startups";

interface HeroLiveSearchProps {
  placeholder?: string;
  className?: string;
}

export default function HeroLiveSearch({
  placeholder = "Search YC startups, AI tech stacks, or Product Hunt products...",
  className = "",
}: HeroLiveSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching YC startups safely
  const matchingStartups = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return startups
      .filter((s) => {
        if (!s) return false;
        const name = (s.name || "").toLowerCase();
        const tagline = ((s as { tagline?: string; oneLiner?: string }).tagline || s.oneLiner || "").toLowerCase();
        const batch = (s.batch || "").toLowerCase();
        const industriesMatch = Array.isArray(s.industries) && s.industries.some((i) => i && i.toLowerCase().includes(q));
        const tagsMatch = Array.isArray(s.tags) && s.tags.some((t) => t && t.toLowerCase().includes(q));

        return (
          name.includes(q) ||
          tagline.includes(q) ||
          batch.includes(q) ||
          industriesMatch ||
          tagsMatch
        );
      })
      .slice(0, 5);
  }, [query]);

  // Featured quick suggestion pills
  const quickSuggestions = [
    { label: "Stripe", href: "/startup/stripe" },
    { label: "Supabase", href: "/startup/supabase" },
    { label: "Cursor AI", href: "/producthunt/ph-cursor" },
    { label: "Next.js", href: "/githuboss?search=next.js" },
    { label: "AI & ML", href: "/yc?search=AI" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/yc?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className={`relative w-full max-w-xl font-sans ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[#49B6E5]" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-900/90 border-2 border-[#263D5B] dark:border-[#49B6E5] text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B]"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-24 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="doodle-btn absolute right-1.5 px-3.5 py-2 bg-[#49B6E5] hover:bg-[#38A5D4] text-[#263D5B] font-bold doodle-font text-xs rounded-lg transition-all"
        >
          Search
        </button>
      </form>

      {/* Quick suggestions under input when query is empty */}
      {!query && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] text-slate-400">
          <span className="font-mono text-slate-500">Popular:</span>
          {quickSuggestions.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-[#49B6E5] hover:text-[#263D5B] border border-slate-700 text-slate-300 transition-colors font-bold doodle-font"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {/* Live Search Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border-4 border-[#263D5B] dark:border-[#49B6E5] rounded-2xl shadow-[6px_6px_0px_0px_#263D5B] p-3.5 z-50 space-y-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between text-[11px] font-extrabold doodle-font text-[#49B6E5] border-b border-slate-800 pb-2 px-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              INSTANT RESULTS ({matchingStartups.length} YC MATCHES)
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Press Enter to view all</span>
          </div>

          {matchingStartups.length > 0 ? (
            <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
              {matchingStartups.map((startup) => (
                <Link
                  key={startup.id}
                  href={`/startup/${startup.slug || startup.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-[#49B6E5]/15 border border-slate-800 hover:border-[#49B6E5]/50 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#49B6E5] text-[#263D5B] font-bold text-xs flex items-center justify-center shrink-0 border border-[#263D5B]">
                      {startup.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="doodle-font font-bold text-sm text-white group-hover:text-[#49B6E5] transition-colors truncate">
                          {startup.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 shrink-0">
                          {startup.batch}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {(startup as { tagline?: string; oneLiner?: string }).tagline || startup.oneLiner || ""}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#49B6E5] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-400">
              No direct startup match for &quot;{query}&quot;. Press Enter to perform full fuzzy search across all 3,400+ startups.
            </div>
          )}

          {/* Full Search Action Bar */}
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 px-3 rounded-xl bg-[#49B6E5] hover:bg-[#38A5D4] text-[#263D5B] font-extrabold doodle-font text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Search &quot;{query}&quot; across 3,400+ YC Startups</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
