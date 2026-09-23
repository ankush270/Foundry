"use client";

import Link from "next/link";
import { TechNewsItem } from "@/modules/technews/types";
import { Lightbulb, ArrowUpRight, Target } from "lucide-react";

interface OpportunityMatrixProps {
  items: TechNewsItem[];
  onOpenDetail?: (item: TechNewsItem) => void;
}

export default function OpportunityMatrix({ items }: OpportunityMatrixProps) {
  // Extract all opportunities with their parent tech news item context
  const opportunities = items.flatMap((item) =>
    item.breakdown.startupOpportunities.map((opp) => ({
      ...opp,
      parentNews: item,
    }))
  );

  if (opportunities.length === 0) {
    return (
      <div className="doodle-card p-10 text-center bg-white dark:bg-[#1E293B]">
        <Lightbulb className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="doodle-font font-black text-lg text-[#263D5B] dark:text-white">
          No White-Space Opportunities Found
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Try broadening your category or search filter to discover new startup vectors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="doodle-card p-5 bg-[#16A34A]/10 flex items-center justify-between">
        <div>
          <h3 className="doodle-font font-black text-lg text-[#263D5B] dark:text-emerald-400 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-500" />
            White-Space Startup Vector Matrix
          </h3>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Foundry analysis synthesizes market disruption and tech evolution into unbundled SaaS and infrastructure business ideas.
          </p>
        </div>
        <span className="doodle-badge text-xs font-black bg-[#16A34A] text-white px-3.5 py-1.5 rounded-full border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]">
          {opportunities.length} Vectors
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp, idx) => (
          <div
            key={idx}
            className="doodle-card p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all bg-white dark:bg-[#1E293B]"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="doodle-font text-[10px] font-black uppercase tracking-wider bg-[#49B6E5] text-[#263D5B] px-2.5 py-1 rounded-full border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]">
                  {opp.parentNews.category}
                </span>

                <span className="doodle-badge text-xs font-black bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full border-2 border-[#263D5B]">
                  {opp.potentialValue} Value
                </span>
              </div>

              {/* Title */}
              <h4 className="doodle-font font-black text-lg text-[#263D5B] dark:text-white leading-snug">
                {opp.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {opp.description}
              </p>
            </div>

            <div className="pt-3 border-t-2 border-dashed border-[#263D5B]/20 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                  Target: {opp.targetMarket}
                </span>
              </div>

              <Link
                href={`/tech-news/${opp.parentNews.slug}`}
                className="doodle-btn w-full py-2 px-3 text-xs font-black flex items-center justify-between text-[#263D5B] bg-[#49B6E5] border-2 border-[#263D5B] shadow-[3px_3px_0px_0px_#263D5B]"
              >
                <span className="truncate">Trend Origin: {opp.parentNews.title}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
