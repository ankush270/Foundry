"use client";

import { useState, useEffect, useRef } from "react";
import { TechNewsItem, TechNewsFilters as FilterState, TechNewsStatsSummary } from "@/modules/technews/types";
import TechNewsStats from "@/modules/technews/components/TechNewsStats";
import TechNewsFilters from "@/modules/technews/components/TechNewsFilters";
import TechNewsCard from "@/modules/technews/components/TechNewsCard";
import TechNewsDetailModal from "@/modules/technews/components/TechNewsDetailModal";
import OpportunityMatrix from "@/modules/technews/components/OpportunityMatrix";
import { Newspaper, SearchX, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Loader2, Zap } from "lucide-react";

export default function TechNewsPage() {
  const [items, setItems] = useState<TechNewsItem[]>([]);
  const [stats, setStats] = useState<TechNewsStatsSummary>({
    totalAnalyzed: 0,
    criticalImpacts: 0,
    whiteSpaceOpportunities: 0,
    topTrendingSkills: [],
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSyncBanner, setShowSyncBanner] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15);
  const [totalItems, setTotalItems] = useState(135);

  const [selectedItem, setSelectedItem] = useState<TechNewsItem | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "opportunities">("cards");

  const gridTopRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    impactLevel: "All",
    sourceType: "All",
    searchQuery: "",
    sortBy: "latest",
  });

  const fetchNews = async (currentPage = page, forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) setIsRefreshing(true);

    try {
      const params = new URLSearchParams();
      if (filters.category !== "All") params.set("category", filters.category);
      if (filters.impactLevel !== "All") params.set("impact", filters.impactLevel);
      if (filters.sourceType !== "All") params.set("sourceType", filters.sourceType);
      if (filters.searchQuery) params.set("q", filters.searchQuery);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);

      params.set("page", currentPage.toString());
      params.set("limit", "9");
      if (forceRefresh) params.set("refresh", "true");

      const res = await fetch(`/api/technews?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setItems(data.data);
        setStats(data.stats);
        setTotalPages(data.totalPages || 15);
        setTotalItems(data.total || 135);

        if (forceRefresh) {
          setShowSyncBanner(true);
          setTimeout(() => setShowSyncBanner(false), 4000);
        }
      }
    } catch (err) {
      console.error("Failed to load tech news:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(page);
  }, [filters, page]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleSkillSelect = (skill: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: skill }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      if (gridTopRef.current) {
        gridTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleRefreshLive = () => {
    setPage(1);
    fetchNews(1, true);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-[1440px] mx-auto font-sans">
      {/* Master Doodle Hero Banner */}
      <div className="relative rounded-3xl bg-[#FFFDF5] dark:bg-[#1E293B] p-6 sm:p-8 text-[#263D5B] dark:text-white border-4 border-[#263D5B] dark:border-[#49B6E5] shadow-[6px_6px_0px_0px_#263D5B] dark:shadow-[6px_6px_0px_0px_#49B6E5] z-30 mb-8">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#49B6E5] text-[#263D5B] text-xs font-black doodle-font border-2 border-[#263D5B] shadow-[2.5px_2.5px_0px_0px_#263D5B]">
            <Newspaper className="w-4 h-4 text-[#263D5B]" />
            FOUNDRY — LIVE STRATEGIC IMPACT ENGINE
          </div>

          <h1 className="doodle-font font-black text-3xl sm:text-5xl tracking-tight leading-tight text-[#263D5B] dark:text-white">
            Tech News <span className="text-[#49B6E5] underline decoration-[#F97316] underline-offset-4">— Strategic Impact Feed</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-bold leading-relaxed max-w-3xl">
            Live technical reports fetched directly from{" "}
            <strong className="text-[#263D5B] dark:text-[#49B6E5] underline decoration-[#49B6E5]">TechCrunch</strong>,{" "}
            <strong className="text-[#F97316]">InfoQ</strong>, and{" "}
            <strong className="text-[#16A34A]">AWS Tech Blog</strong> into 8-dimensional strategic insight models:{" "}
            <span className="font-black text-[#263D5B] dark:text-white bg-[#49B6E5]/20 dark:bg-[#49B6E5]/30 px-2 py-0.5 rounded border border-[#263D5B]">
              What Happened → Why It Matters → Who Is Affected → Startup Ideas
            </span>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-black doodle-font text-slate-600 dark:text-slate-300 pt-3 border-t-2 border-dashed border-[#263D5B]/30 dark:border-[#49B6E5]/30">
            <div>
              <strong className="text-[#49B6E5]">Live Feeds:</strong> TechCrunch, InfoQ, AWS Blog
            </div>
            <span className="text-slate-400">•</span>
            <div>
              <strong className="text-[#F97316]">Depth:</strong> 8 Strategic Dimensions
            </div>
            <span className="text-slate-400">•</span>
            <div>
              <strong className="text-[#16A34A]">Coverage:</strong> 15+ Pages Live
            </div>
          </div>
        </div>
      </div>

      {/* Sync Success Banner */}
      {showSyncBanner && (
        <div className="doodle-card max-w-xl mx-auto mb-6 p-4 bg-[#16A34A]/20 border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white flex items-center justify-between text-xs font-black doodle-font shadow-[3px_3px_0px_0px_#263D5B]">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            Latest live breaking news synced from TechCrunch, InfoQ, and AWS Blog!
          </span>
          <Sparkles className="w-4 h-4 text-[#F97316] shrink-0" />
        </div>
      )}

      {/* Stats Bar (Doodle Theme) */}
      <TechNewsStats
        stats={stats}
        activeCategory={filters.category}
        onSelectSkill={handleSkillSelect}
      />

      {/* Scroll Anchor */}
      <div ref={gridTopRef} />

      {/* Filters & Controls (Doodle Theme) */}
      <TechNewsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefreshLive={handleRefreshLive}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div
              key={n}
              className="doodle-card h-80 bg-white dark:bg-[#1E293B] flex flex-col items-center justify-center space-y-3"
            >
              <Loader2 className="w-8 h-8 text-[#49B6E5] animate-spin" />
              <span className="doodle-font font-black text-xs text-slate-500">Loading Live Feed...</span>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="doodle-card text-center py-20 bg-white dark:bg-[#1E293B]">
          <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="doodle-font font-black text-xl text-[#263D5B] dark:text-white">
            No Tech News Matches Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6 font-medium">
            We couldn't find any news items matching your current filters or search query.
          </p>
          <button
            onClick={() =>
              setFilters({
                category: "All",
                impactLevel: "All",
                sourceType: "All",
                searchQuery: "",
                sortBy: "latest",
              })
            }
            className="doodle-btn px-5 py-2.5 text-xs font-black bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B]"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <TechNewsCard
              key={item.id}
              item={item}
              onOpenDetail={setSelectedItem}
            />
          ))}
        </div>
      ) : (
        <OpportunityMatrix
          items={items}
          onOpenDetail={setSelectedItem}
        />
      )}

      {/* Doodle Pagination Bar */}
      {!loading && totalItems > 0 && (
        <div className="mt-12 pt-6 border-t-2 border-dashed border-[#263D5B]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="doodle-font text-xs font-black text-[#263D5B] dark:text-slate-300">
            Page <strong className="text-[#49B6E5]">{page}</strong> of{" "}
            <strong className="text-[#263D5B] dark:text-white">{totalPages}</strong> • Multi-Page Live Feed
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="doodle-btn px-3 py-2 text-xs font-black flex items-center gap-1 text-[#263D5B] bg-white dark:bg-[#1E293B] dark:text-white border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[2px_2px_0px_0px_#263D5B] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pNum, idx) => {
              if (pNum === "...") {
                return (
                  <span key={`dots-${idx}`} className="doodle-font px-2 text-xs font-black text-slate-400">
                    ...
                  </span>
                );
              }

              const num = pNum as number;
              const active = page === num;
              return (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`doodle-font w-9 h-9 rounded-xl text-xs font-black border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[2px_2px_0px_0px_#263D5B] transition-all ${
                    active
                      ? "bg-[#49B6E5] text-[#263D5B] scale-105"
                      : "bg-white dark:bg-[#1E293B] text-[#263D5B] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {num}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="doodle-btn px-3 py-2 text-xs font-black flex items-center gap-1 text-[#263D5B] bg-white dark:bg-[#1E293B] dark:text-white border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[2px_2px_0px_0px_#263D5B] disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Optional Modal Fallback */}
      <TechNewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </main>
  );
}
