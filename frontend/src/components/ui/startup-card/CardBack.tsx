"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, GitCompareArrows, ExternalLink, Sparkles, ArrowRight, Code2 } from "lucide-react";
import type { Startup } from "@/data/types";
import { useCompareStore } from "@/store/compare.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import TechStackLinker from "@/modules/cross-intelligence/components/TechStackLinker";

interface Props {
  startup: Startup;
}

export default function CardBack({ startup }: Props) {
  const { add, remove, isSelected } = useCompareStore();
  const { toggle, isWatched } = useWatchlistStore();
  const comparing = isSelected(startup.id);
  const watched = isWatched(startup.id);
  const [isOssOpen, setIsOssOpen] = useState(false);

  return (
    <>
      <div className="w-full h-full rounded-2xl doodle-card p-4 sm:p-5 flex flex-col justify-between shadow-2xl bg-[var(--surface)] overflow-y-auto custom-scrollbar" data-lenis-prevent>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <h3 className="doodle-font font-extrabold text-base text-[var(--foreground)] truncate">{startup.name}</h3>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono">[{startup.batch}] • {startup.location}</span>
            </div>
            {startup.isHiring && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" /> Hiring ({startup.jobCount || 1})
              </span>
            )}
          </div>

          {/* 1. What They Do */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1 font-mono">
              💡 WHAT THEY DO & VALUE PROPOSITION
            </span>
            <p className="text-xs text-[var(--foreground)] leading-relaxed line-clamp-3 font-normal">
              {startup.oneLiner || startup.longDescription?.slice(0, 140) || "Pioneering innovation in " + (startup.industries[0] || "technology") + "."}
            </p>
          </div>

          {/* 2. Industry & Domain Tags */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1 font-mono">
              🏷️ INDUSTRIES & DOMAINS
            </span>
            <div className="flex flex-wrap gap-1">
              {startup.industries.map((ind) => (
                <span
                  key={ind}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50"
                >
                  {ind}
                </span>
              ))}
              {startup.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Quick stats 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Founded Year", value: String(startup.year) },
              { label: "Team Size", value: startup.teamSize || "10-50" },
              { label: "Funding Stage", value: startup.fundingStage || "Series Round" },
              { label: "Status", value: startup.status },
            ].map((s) => (
              <div key={s.label} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[9px] font-semibold block leading-none mb-1 font-mono uppercase">{s.label}</span>
                <p className="font-bold doodle-font text-[var(--foreground)] truncate text-xs">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* 4. Founders */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1 font-mono">
              👥 FOUNDING TEAM
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {startup.founders.slice(0, 2).map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {f.avatar ? (
                    <img src={f.avatar} alt={f.name} loading="lazy" decoding="async" className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-300 dark:border-slate-700" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                      {f.name[0]}
                    </div>
                  )}
                  <div className="truncate text-xs flex-1 min-w-0">
                    <span className="font-semibold text-[var(--foreground)] block truncate leading-none mb-0.5 text-[11px]">{f.name}</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate">{f.title || "Founder"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/startup/${startup.slug}?tab=oss`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" /> Tech Stack
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/startup/${startup.slug}`}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Full Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggle(startup.id); }}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                watched ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${watched ? "fill-current" : ""}`} /> {watched ? "Saved" : "Save"}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); comparing ? remove(startup.id) : add(startup); }}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                comparing ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500"
              }`}
            >
              <GitCompareArrows className="w-3.5 h-3.5" /> {comparing ? "Added" : "Compare"}
            </button>
            <a
              href={startup.website} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* OSS Tech Stack Modal */}
      <TechStackLinker
        startup={startup}
        isOpen={isOssOpen}
        onClose={() => setIsOssOpen(false)}
      />
    </>
  );
}
