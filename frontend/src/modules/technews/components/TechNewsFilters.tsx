"use client";

import { NewsCategory, ImpactLevel, TechNewsFilters as FilterState } from "@/modules/technews/types";
import { Search, SlidersHorizontal, Flame, Lightbulb, LayoutList, RefreshCw } from "lucide-react";

interface TechNewsFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  viewMode: "cards" | "opportunities";
  onViewModeChange: (mode: "cards" | "opportunities") => void;
  onRefreshLive: () => void;
  isRefreshing: boolean;
}

const CATEGORIES: (NewsCategory | "All")[] = [
  "All",
  "AI & Autonomous Systems",
  "DevTools & Cloud Native",
  "Data Engine & Databases",
  "Cybersecurity & Zero Trust",
  "Frontend & Modern Web",
  "Enterprise & Architecture",
];

const IMPACT_LEVELS: (ImpactLevel | "All")[] = ["All", "Critical", "High", "Medium"];

export default function TechNewsFilters({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onRefreshLive,
  isRefreshing,
}: TechNewsFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Search Bar & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input (Doodle Style) */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search news, companies, tech stack..."
            className="w-full bg-white dark:bg-[#1E293B] text-[#263D5B] dark:text-white pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] dark:shadow-[3px_3px_0px_0px_#49B6E5] text-xs font-bold focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Action Buttons: Sync Live News, View Switcher, Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap sm:flex-nowrap">
          {/* Sync Live News Button (Doodle Button) */}
          <button
            onClick={onRefreshLive}
            disabled={isRefreshing}
            className="doodle-btn px-4 py-2.5 text-xs font-black flex items-center gap-2 text-[#263D5B] bg-[#49B6E5] hover:bg-[#38a5d4] border-2 border-[#263D5B] shadow-[3px_3px_0px_0px_#263D5B] transition-all disabled:opacity-60"
            title="Fetch breaking live news from TechCrunch, InfoQ, and AWS Blog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync Live News"}</span>
          </button>

          {/* View Mode Switcher (Doodle Style) */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[2px_2px_0px_0px_#263D5B]">
            <button
              onClick={() => onViewModeChange("cards")}
              className={`doodle-font flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === "cards"
                  ? "bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                  : "text-slate-600 dark:text-slate-400 hover:text-[#263D5B] dark:hover:text-white"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Cards
            </button>

            <button
              onClick={() => onViewModeChange("opportunities")}
              className={`doodle-font flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === "opportunities"
                  ? "bg-[#16A34A] text-white border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                  : "text-slate-600 dark:text-slate-400 hover:text-[#263D5B] dark:hover:text-white"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Opportunities
            </button>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-white dark:bg-[#1E293B] text-[#263D5B] dark:text-white doodle-font text-xs font-black px-3.5 py-2.5 rounded-xl border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] dark:shadow-[3px_3px_0px_0px_#49B6E5] focus:outline-none"
            >
              <option value="latest">Sort: Latest First</option>
              <option value="impact">Sort: Highest Impact</option>
              <option value="opportunities">Sort: Most Ideas</option>
              <option value="trending">Sort: Trending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills (Doodle Style) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map((cat) => {
          const active = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`doodle-font px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[2px_2px_0px_0px_#263D5B] ${
                active
                  ? "bg-[#49B6E5] text-[#263D5B]"
                  : "bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Impact Level Pills */}
      <div className="flex items-center gap-2">
        <span className="doodle-font text-xs font-black text-[#263D5B] dark:text-slate-300 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-[#F97316]" /> Impact:
        </span>
        {IMPACT_LEVELS.map((level) => {
          const active = filters.impactLevel === level;
          return (
            <button
              key={level}
              onClick={() => onFilterChange({ impactLevel: level })}
              className={`doodle-font px-3 py-1 rounded-lg text-xs font-black transition-all border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[1.5px_1.5px_0px_0px_#263D5B] ${
                active
                  ? "bg-[#F97316] text-white"
                  : "bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
}
