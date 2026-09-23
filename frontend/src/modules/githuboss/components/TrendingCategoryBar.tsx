"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CATEGORY_TAXONOMIES, 
  CategoryTaxonomy, 
  SubCategory 
} from "../category-taxonomy";
import { TrendingDiscoveryMode } from "../types";
import { 
  Brain, 
  Layers, 
  Code2, 
  Server, 
  Layout, 
  Terminal, 
  Shield, 
  Database, 
  BarChart3, 
  Bot, 
  Flame, 
  Gem, 
  TrendingUp, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  X,
  Compass,
  Filter
} from "lucide-react";

interface TrendingCategoryBarProps {
  activeCategory: string | null;
  activeSubCategory: SubCategory | null;
  activeMode: TrendingDiscoveryMode;
  onSelectCategory: (category: CategoryTaxonomy | null) => void;
  onSelectSubCategory: (subCategory: SubCategory | null) => void;
  onSelectMode: (mode: TrendingDiscoveryMode) => void;
  totalResultsCount?: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  Server: <Server className="w-4 h-4" />,
  Layout: <Layout className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Bot: <Bot className="w-4 h-4" />,
};

export const TrendingCategoryBar: React.FC<TrendingCategoryBarProps> = ({
  activeCategory,
  activeSubCategory,
  activeMode,
  onSelectCategory,
  onSelectSubCategory,
  onSelectMode,
  totalResultsCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedCategoryObj = CATEGORY_TAXONOMIES.find(
    (c) => c.id === activeCategory || c.name === activeCategory
  );

  const discoveryModes: { id: TrendingDiscoveryMode; label: string; icon: React.ReactNode; badgeColor: string }[] = [
    { 
      id: "all", 
      label: "All Repos", 
      icon: <Compass className="w-3.5 h-3.5" />, 
      badgeColor: "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600" 
    },
    { 
      id: "trending", 
      label: "🔥 Trending Today", 
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />, 
      badgeColor: "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-500/60" 
    },
    { 
      id: "gems", 
      label: "💎 Hidden Gems (<3k ⭐)", 
      icon: <Gem className="w-3.5 h-3.5 text-emerald-400" />, 
      badgeColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/60" 
    },
    { 
      id: "emerging", 
      label: "🚀 Emerging (3k-20k ⭐)", 
      icon: <TrendingUp className="w-3.5 h-3.5 text-sky-400" />, 
      badgeColor: "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-500/60" 
    },
    { 
      id: "top", 
      label: "🏆 Mega Titans (20k+ ⭐)", 
      icon: <Trophy className="w-3.5 h-3.5 text-indigo-400" />, 
      badgeColor: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:border-indigo-500/60" 
    },
  ];

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-2xl mb-8 transition-all">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Open Source Discovery Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore curated tech hierarchies beyond 20k stars. Click any category or sub-topic to discover live repos.
          </p>
        </div>

        {/* Discovery Mode Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {discoveryModes.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  isActive
                    ? "border-indigo-500 bg-indigo-600/20 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                    : mode.badgeColor
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Category Bar */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Primary Categories
          </span>
          {activeCategory && (
            <button
              onClick={() => {
                onSelectCategory(null);
                onSelectSubCategory(null);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectSubCategory(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
              !activeCategory
                ? "bg-slate-100 text-slate-950 font-bold border-white shadow-lg shadow-slate-100/10"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            All Categories
          </button>

          {CATEGORY_TAXONOMIES.map((cat) => {
            const isSelected = activeCategory === cat.id || activeCategory === cat.name;
            const icon = ICON_MAP[cat.iconName] || <Compass className="w-4 h-4" />;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (isSelected) {
                    onSelectCategory(null);
                    onSelectSubCategory(null);
                  } else {
                    onSelectCategory(cat);
                    onSelectSubCategory(null);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold border-indigo-400 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700"
                }`}
              >
                <span className={isSelected ? "text-white" : "text-indigo-400"}>
                  {icon}
                </span>
                <span>{cat.name}</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
                  {cat.subCategories.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategory Hierarchical Tree */}
      <AnimatePresence>
        {selectedCategoryObj && selectedCategoryObj.subCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 pt-4 border-t border-slate-800/60"
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
              <span>{selectedCategoryObj.name} Sub-Topics:</span>
              <span className="text-slate-500 text-[11px] font-normal">
                ({selectedCategoryObj.description})
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSelectSubCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  !activeSubCategory
                    ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/50 font-semibold"
                    : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                All {selectedCategoryObj.name}
              </button>

              {selectedCategoryObj.subCategories.map((sub) => {
                const isSubSelected = activeSubCategory?.id === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (isSubSelected) {
                        onSelectSubCategory(null);
                      } else {
                        onSelectSubCategory(sub);
                      }
                    }}
                    title={sub.description}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSubSelected
                        ? "bg-violet-600 text-white font-semibold border-violet-400 shadow-md shadow-violet-600/20"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/70"
                    }`}
                  >
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Breadcrumbs & Result Bar */}
      {(activeCategory || activeSubCategory || activeMode !== "all") && (
        <div className="mt-4 pt-3 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">Active Path:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-indigo-300">
              {selectedCategoryObj ? selectedCategoryObj.name : "All Categories"}
            </span>

            {activeSubCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/60 font-mono text-violet-300">
                  {activeSubCategory.name}
                </span>
              </>
            )}

            {activeMode !== "all" && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 font-mono text-amber-300 capitalize">
                  {discoveryModes.find((m) => m.id === activeMode)?.label}
                </span>
              </>
            )}
          </div>

          {totalResultsCount !== undefined && totalResultsCount > 0 && (
            <div className="text-slate-400 text-xs">
              Found <strong className="text-slate-200">{totalResultsCount.toLocaleString()}</strong> matching repositories
            </div>
          )}
        </div>
      )}
    </div>
  );
};
