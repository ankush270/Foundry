"use client";

import { TechNewsStatsSummary } from "@/modules/technews/types";
import { Zap, Flame, Lightbulb, Sparkles } from "lucide-react";

interface TechNewsStatsProps {
  stats: TechNewsStatsSummary;
  activeCategory: string;
  onSelectSkill: (skill: string) => void;
}

export default function TechNewsStats({ stats, activeCategory, onSelectSkill }: TechNewsStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Metric 1 */}
      <div className="doodle-card p-5 bg-white dark:bg-[#1E293B] border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#49B6E5] text-[var(--foreground)] border border-[var(--border-color)] flex items-center justify-center font-black text-base shadow-sm shrink-0">
            <Zap className="w-5 h-5 text-[var(--foreground)]" />
          </div>
          <div>
            <p className="doodle-font text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Foundry Trends
            </p>
            <h3 className="doodle-font font-black text-2xl text-[var(--foreground)] dark:text-white">
              {stats.totalAnalyzed} <span className="text-xs font-black text-slate-500">Breakdowns</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="doodle-card p-5 bg-white dark:bg-[#1E293B] border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FF6154] text-white border border-[var(--border-color)] flex items-center justify-center font-black text-base shadow-sm shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="doodle-font text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Critical Tech Shifts
            </p>
            <h3 className="doodle-font font-black text-2xl text-[var(--foreground)] dark:text-white">
              {stats.criticalImpacts} <span className="text-xs font-black text-[#FF6154]">High Impact</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="doodle-card p-5 bg-white dark:bg-[#1E293B] border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#16A34A] text-white border border-[var(--border-color)] flex items-center justify-center font-black text-base shadow-sm shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <p className="doodle-font text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              White-Space Ideas
            </p>
            <h3 className="doodle-font font-black text-2xl text-[var(--foreground)] dark:text-white">
              {stats.whiteSpaceOpportunities} <span className="text-xs font-black text-[#16A34A]">Startup Vectors</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Metric 4 - Trending Skills */}
      <div className="doodle-card p-5 bg-white dark:bg-[#1E293B] border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="doodle-font text-[10px] font-black uppercase tracking-wider text-[var(--foreground)] dark:text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> High-Demand Skills
          </span>
          <span className="doodle-badge text-[9px] bg-[#F97316] text-white px-2 py-0.5 rounded-full border border-[var(--border-color)] shadow-sm">
            Foundry Radar
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {stats.topTrendingSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => onSelectSkill(skill)}
              className="doodle-font text-[11px] font-black bg-[#49B6E5]/20 hover:bg-[#49B6E5] text-[var(--foreground)] dark:text-[var(--accent)] dark:hover:text-[var(--foreground)] px-2.5 py-0.5 rounded-lg border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm shadow-sm transition-all"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
