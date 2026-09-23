"use client";

import Link from "next/link";
import { TechNewsItem } from "@/modules/technews/types";
import {
  Flame,
  Zap,
  Building2,
  Cpu,
  TrendingUp,
  Code2,
  ArrowRight,
  Clock,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface TechNewsCardProps {
  item: TechNewsItem;
  onOpenDetail?: (item: TechNewsItem) => void;
}

export default function TechNewsCard({ item }: TechNewsCardProps) {
  const topOpportunity = item.breakdown.startupOpportunities[0];
  const topOSRepo = item.breakdown.openSourceProjects[0];

  const impactBadgeStyle =
    item.impactLevel === "Critical"
      ? "bg-[#EF4444] text-white"
      : item.impactLevel === "High"
      ? "bg-[#F97316] text-white"
      : "bg-[#49B6E5] text-[#263D5B]";

  return (
    <div className="doodle-card p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all relative overflow-hidden bg-white dark:bg-[#1E293B]">
      <div className="space-y-3.5">
        {/* Header Tags (Doodle Style) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="doodle-font font-black text-[11px] px-3 py-1 rounded-full border-2 border-[#263D5B] dark:border-[#49B6E5] bg-[#49B6E5] text-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]">
              {item.category}
            </span>

            <span
              className={`doodle-font font-black text-[11px] px-2.5 py-1 rounded-full border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[2px_2px_0px_0px_#263D5B] flex items-center gap-1 ${impactBadgeStyle}`}
            >
              <Flame className="w-3 h-3" />
              {item.impactLevel} Impact
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            {item.readTimeMinutes} min
          </div>
        </div>

        {/* Headline */}
        <Link href={`/tech-news/${item.slug}`}>
          <h3 className="doodle-font font-black text-lg sm:text-xl text-[#263D5B] dark:text-white leading-snug hover:text-indigo-600 dark:hover:text-[#49B6E5] transition-colors">
            {item.title}
          </h3>
        </Link>

        {/* Source & Date Info */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 pt-0.5">
          <span>Source: <strong className="text-[#263D5B] dark:text-[#49B6E5]">{item.source.name}</strong></span>
          <a
            href={item.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-[#49B6E5] hover:underline"
          >
            Original Feed <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Strategic Premise */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
          {item.premise}
        </p>

        {/* 4-Stage Mini Grid (Doodle Neobrutalist Box) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border-2 border-[#263D5B]/30 dark:border-[#49B6E5]/40 bg-slate-50 dark:bg-slate-800/60 shadow-[2px_2px_0px_0px_#263D5B] dark:shadow-[2px_2px_0px_0px_#49B6E5]">
          {/* Stage 1: What Happened */}
          <div className="space-y-0.5">
            <div className="doodle-font text-[10px] font-black uppercase text-indigo-600 dark:text-[#49B6E5] flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> 1. What Happened
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-tight">
              {item.breakdown.whatHappened}
            </p>
          </div>

          {/* Stage 2: Who Is Affected */}
          <div className="space-y-0.5">
            <div className="doodle-font text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> 2. Companies
            </div>
            <div className="flex flex-wrap gap-1">
              {item.breakdown.companiesInvolved.slice(0, 2).map((comp) => (
                <span
                  key={comp}
                  className="text-[10px] font-bold bg-white dark:bg-slate-700 text-[#263D5B] dark:text-slate-200 px-1.5 py-0.2 rounded border border-[#263D5B]/20 dark:border-slate-600"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Stage 3: Top White Space Opportunity */}
          {topOpportunity && (
            <div className="space-y-0.5">
              <div className="doodle-font text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 3. Startup Idea
              </div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {topOpportunity.title}
              </p>
            </div>
          )}

          {/* Stage 4: Open Source Reference */}
          {topOSRepo && (
            <div className="space-y-0.5">
              <div className="doodle-font text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Code2 className="w-3 h-3" /> 4. OS Repo
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                <span className="truncate">{topOSRepo.name}</span>
                {topOSRepo.stars && (
                  <span className="text-[9px] bg-amber-500 text-white px-1 rounded font-black shrink-0">
                    ★{(topOSRepo.stars / 1000).toFixed(1)}k
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Button (Doodle Button) */}
      <div className="pt-2 border-t-2 border-dashed border-[#263D5B]/20 dark:border-[#49B6E5]/20 flex items-center justify-between">
        <Link
          href={`/tech-news/${item.slug}`}
          className="doodle-btn w-full py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] dark:shadow-[3px_3px_0px_0px_#49B6E5] transition-all"
        >
          <span>Foundry Breakdown Page</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
