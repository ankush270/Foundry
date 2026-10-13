"use client";
import { useRefreshTick } from "@/hooks/useRefreshTick";

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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedItem, setSelectedItem] = useState<TechNewsItem | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "opportunities">("cards");

  const requestId = useRef(0);
  const [dataSource, setDataSource] = useState("Loading sources");
  const [error, setError] = useState<string | null>(null);

  const gridTopRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    impactLevel: "All",
    sourceType: "All",
    searchQuery: "",
    sortBy: "latest",
  });

  const refreshTick = useRefreshTick();
  const fetchNews = async (currentPage = page, forceRefresh = false) => {
    const currentRequest = ++requestId.current;
    setError(null);
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
      if (!res.ok) throw new Error("News could not be loaded. Please retry.");
      const data = await res.json();
      if (currentRequest !== requestId.current) return;

      if (data.success) {
        setItems(data.data);
        setStats(data.stats ?? { totalAnalyzed: 0, criticalImpacts: 0, whiteSpaceOpportunities: 0, topTrendingSkills: [] });
        setDataSource(data.source ?? "Curated dataset");
        setTotalPages(data.totalPages ?? 1);
        setTotalItems(data.total ?? 0);

        if (forceRefresh) {
          setShowSyncBanner(true);
          setTimeout(() => setShowSyncBanner(false), 4000);
        }
      }
    } catch (err) {
      if (currentRequest === requestId.current) { setItems([]); setTotalItems(0); setTotalPages(1); setDataSource("Live feed unavailable"); setError(err instanceof Error ? err.message : "News could not be loaded."); }
    } finally {
      if (currentRequest === requestId.current) { setLoading(false); setIsRefreshing(false); }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { void fetchNews(page); }, 0);
    return () => { clearTimeout(timer); requestId.current++; };
  }, [filters, page, refreshTick]);

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
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-[1680px] mx-auto font-sans">
      {/* Master Doodle Hero Banner */}
      <div className="relative rounded-3xl bg-[#FFFDF5] dark:bg-[#1E293B] p-6 sm:p-8 text-[var(--foreground)] dark:text-white border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm shadow-sm z-30 mb-8">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#49B6E5] text-[var(--foreground)] text-xs font-black doodle-font border border-[var(--border-color)] shadow-sm">
            <Newspaper className="w-4 h-4 text-[var(--foreground)]" />
            FOUNDRY — LIVE STRATEGIC IMPACT ENGINE
          </div>

          <h1 className="doodle-font font-black text-3xl sm:text-5xl tracking-tight leading-tight text-[var(--foreground)] dark:text-white">
            Tech News <span className="text-[var(--accent)] underline decoration-[#F97316] underline-offset-4">— Strategic Impact Feed</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-bold leading-relaxed max-w-3xl">
            Technical reports and analysis from{" "}
            <strong className="text-[var(--foreground)] dark:text-[var(--accent)] underline decoration-[#49B6E5]">TechCrunch</strong>,{" "}
            <strong className="text-[#F97316]">InfoQ</strong>, and{" "}
            <strong className="text-[#16A34A]">AWS Tech Blog</strong> into 8-dimensional strategic insight models:{" "}
            <span className="font-black text-[var(--foreground)] dark:text-white bg-[#49B6E5]/20 dark:bg-[#49B6E5]/30 px-2 py-0.5 rounded border border-[#263D5B]">
              What Happened → Why It Matters → Who Is Affected → Startup Ideas
            </span>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-black doodle-font text-slate-600 dark:text-slate-300 pt-3 border-t-2 border-dashed border-[#263D5B]/30 dark:border-[var(--border-color)]/30">
            <div>
              <strong className="text-[var(--accent)]">Sources:</strong> Hacker News, TechCrunch, Dev.to
            </div>
            <span className="text-slate-400">•</span>
            <div>
              <strong className="text-[#F97316]">Depth:</strong> 8 Strategic Dimensions
            </div>
            <span className="text-slate-400">•</span>
            <div>
              <strong className="text-[#16A34A]">Coverage:</strong> {totalPages} Pages
            </div>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm" role="status">Source: {dataSource}. Analysis and opportunities are generated suggestions; verify with the linked source.</p>
      {error && <p role="alert">{error}</p>}
      {/* Sync Success Banner */}
      {showSyncBanner && (
        <div className="doodle-card max-w-xl mx-auto mb-6 p-4 bg-[#16A34A]/20 border border-[var(--border-color)] dark:border-[var(--border-color)] text-[var(--foreground)] dark:text-white flex items-center justify-between text-xs font-black doodle-font shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            News refreshed. Source: {dataSource}.
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
              <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
              <span className="doodle-font font-black text-xs text-slate-500">Loading News...</span>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="doodle-card text-center py-20 bg-white dark:bg-[#1E293B]">
          <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="doodle-font font-black text-xl text-[var(--foreground)] dark:text-white">
            No Tech News Matches Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6 font-medium">
            We couldn&apos;t find any news items matching your current filters or search query.
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
            className="doodle-btn px-5 py-2.5 text-xs font-black bg-[#49B6E5] text-[var(--foreground)] border border-[var(--border-color)]"
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
          <div className="doodle-font text-xs font-black text-[var(--foreground)] dark:text-slate-300">
            Page <strong className="text-[var(--accent)]">{page}</strong> of{" "}
            <strong className="text-[var(--foreground)] dark:text-white">{totalPages}</strong> • News Feed
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="doodle-btn px-3 py-2 text-xs font-black flex items-center gap-1 text-[var(--foreground)] bg-white dark:bg-[#1E293B] dark:text-white border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm disabled:opacity-40"
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
                  className={`doodle-font w-9 h-9 rounded-xl text-xs font-black border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm transition-all ${
                    active
                      ? "bg-[#49B6E5] text-[var(--foreground)] scale-105"
                      : "bg-white dark:bg-[#1E293B] text-[var(--foreground)] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
              className="doodle-btn px-3 py-2 text-xs font-black flex items-center gap-1 text-[var(--foreground)] bg-white dark:bg-[#1E293B] dark:text-white border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm disabled:opacity-40"
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
