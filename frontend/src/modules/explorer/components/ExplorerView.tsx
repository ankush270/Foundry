"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Sparkles, Building2, Zap, Briefcase, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startups } from "@/data/startups";
import { emptyFilters } from "@/data/types";
import type { Filters } from "@/data/types";
import { useDebounce, useFuzzySearch } from "@/hooks";
import StartupCard from "@/components/ui/startup-card";
import SearchBar from "@/components/search/SearchBar";
import FilterPanel from "@/components/ui/filter-panel";
import { PAGE_SIZE } from "@/lib/constants";

import GsapCounter from "@/components/animations/GsapCounter";
import GsapMagnetic from "@/components/animations/GsapMagnetic";

export default function ExplorerView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? (searchParams.get("search") || searchParams.get("q") || "") : "";
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const qParam = searchParams ? (searchParams.get("search") || searchParams.get("q") || "") : "";
    if (qParam) {
      setQuery(qParam);
    }
  }, [searchParams]);

  const debouncedQuery = useDebounce(query, 200);
  const searched = useFuzzySearch(startups, debouncedQuery);

  const filtered = useMemo(() => {
    let result = searched;

    // 1. Industries filter
    if (filters.industries && filters.industries.length > 0) {
      result = result.filter((s) => s.industries.some((i) => filters.industries.includes(i)));
    }

    // 2. Funding Stage filter
    if (filters.fundingStages && filters.fundingStages.length > 0) {
      result = result.filter((s) => s.fundingStage && filters.fundingStages.includes(s.fundingStage));
    }

    // 3. Batches filter
    if (filters.batches && filters.batches.length > 0) {
      result = result.filter((s) => filters.batches.includes(s.batch));
    }

    // 4. Statuses filter
    if (filters.statuses && filters.statuses.length > 0) {
      result = result.filter((s) => filters.statuses.includes(s.status));
    }

    // 5. Countries filter
    if (filters.countries && filters.countries.length > 0) {
      result = result.filter((s) => filters.countries.includes(s.country));
    }

    // 6. Tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((s) => s.tags.some((t) => filters.tags.includes(t)));
    }

    // 7. Hiring Only filter
    if (filters.isHiring === true) {
      result = result.filter((s) => s.isHiring || (s.jobs && s.jobs.length > 0));
    } else if (filters.isHiring === false) {
      result = result.filter((s) => !s.isHiring && (!s.jobs || s.jobs.length === 0));
    }

    // 8. AI Category filter
    if (filters.hasAI === true) {
      result = result.filter((s) => s.industries.includes("AI") || s.tags.includes("AI"));
    } else if (filters.hasAI === false) {
      result = result.filter((s) => !s.industries.includes("AI") && !s.tags.includes("AI"));
    }

    // 9. Sorting
    if (filters.sortBy && filters.sortBy !== "relevance") {
      result = [...result].sort((a, b) => {
        switch (filters.sortBy) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "year-desc":
            return b.year - a.year;
          case "year-asc":
            return a.year - b.year;
          case "team-desc": {
            const sizeA = a.teamSize ? parseInt(a.teamSize, 10) || 0 : 0;
            const sizeB = b.teamSize ? parseInt(b.teamSize, 10) || 0 : 0;
            return sizeB - sizeA;
          }
          case "jobs-desc": {
            const jobsA = a.jobCount || (a.jobs ? a.jobs.length : 0);
            const jobsB = b.jobCount || (b.jobs ? b.jobs.length : 0);
            return jobsB - jobsA;
          }
          default:
            return 0;
        }
      });
    }

    return result;
  }, [searched, filters]);

  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = paginated.length < filtered.length;

  const surpriseMe = useCallback(() => {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    if (random) router.push(`/startup/${random.slug}`);
  }, [filtered, router]);

  const totalActive = useMemo(() => startups.filter((s) => s.status === "Active").length, []);
  const aiCount = useMemo(() => startups.filter((s) => s.industries.includes("AI") || s.tags.includes("AI")).length, []);
  const hiringCount = useMemo(() => startups.filter((s) => s.isHiring || (s.jobs && s.jobs.length > 0)).length, []);

  return (
    <div className="min-h-screen relative overflow-hidden pt-6">
      <section className="relative z-10 pt-4 pb-6 max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Dedicated YC Header Banner */}
        <div className="rounded-3xl bg-[#FAF8F5] dark:bg-[#111827] border-4 border-[#263D5B] dark:border-[#49B6E5] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#263D5B] dark:shadow-[6px_6px_0px_0px_#49B6E5] mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#263D5B]/20">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] text-xs font-bold doodle-font mb-2">
                <Building2 className="w-4 h-4" /> Y COMBINATOR EXPLORER
              </div>
              <h1 className="doodle-font font-black text-3xl sm:text-5xl text-[#263D5B] dark:text-[#49B6E5]">
                3,400+ YC Startups Database
              </h1>
              <p className="text-xs sm:text-sm text-[var(--muted)] max-w-2xl mt-1">
                Deep dive into Y Combinator batch histories (S05-W26), founder details, hiring status, and AI domain breakdowns.
              </p>
            </div>

            <GsapMagnetic strength={0.3}>
              <button
                onClick={surpriseMe}
                className="doodle-btn flex items-center gap-2 px-4 py-2.5 text-xs font-black shrink-0"
              >
                <Shuffle className="w-4 h-4" /> Surprise Me! 🎲
              </button>
            </GsapMagnetic>
          </div>

          {/* Quick Metrics Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5]">
              <span className="text-[10px] font-mono font-bold text-[var(--muted)] uppercase block">Total Startups</span>
              <span className="doodle-font font-extrabold text-xl text-[#263D5B] dark:text-white">
                <GsapCounter value={startups.length} />
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5]">
              <span className="text-[10px] font-mono font-bold text-[var(--muted)] uppercase block">Active Hiring</span>
              <span className="doodle-font font-extrabold text-xl text-[#16A34A]">
                <GsapCounter value={hiringCount} /> Jobs
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5]">
              <span className="text-[10px] font-mono font-bold text-[var(--muted)] uppercase block">AI Companies</span>
              <span className="doodle-font font-extrabold text-xl text-[#49B6E5]">
                <GsapCounter value={aiCount} />
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5]">
              <span className="text-[10px] font-mono font-bold text-[var(--muted)] uppercase block">Active Companies</span>
              <span className="doodle-font font-extrabold text-xl text-[#D97706]">
                <GsapCounter value={totalActive} />
              </span>
            </div>
          </div>
        </div>

        {/* YC Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111827] border-2 border-[#263D5B] dark:border-[#49B6E5] p-4 rounded-2xl shadow-[4px_4px_0px_0px_#263D5B] dark:shadow-[4px_4px_0px_0px_#49B6E5] mb-6">
          <div className="w-full sm:flex-1">
            <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <FilterPanel filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} totalFilteredCount={filtered.length} />
          </div>
        </div>
      </section>

      {/* Startup Grid Section */}
      <section id="startup-grid" className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 pb-20 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <p className="text-xs sm:text-sm font-medium text-[var(--muted)]">
            Showing <span className="font-bold text-[var(--foreground)]">{paginated.length}</span> of{" "}
            <span className="font-bold text-[var(--foreground)]">{filtered.length}</span> startups
          </p>

          {(filters.industries.length > 0 || filters.batches.length > 0 || filters.statuses.length > 0 || query) && (
            <button
              onClick={() => { setQuery(""); setFilters(emptyFilters); setPage(1); }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={debouncedQuery + JSON.stringify(filters)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {paginated.map((startup, i) => (
              <StartupCard key={startup.id} startup={startup} index={i % PAGE_SIZE} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24 glass-card rounded-3xl max-w-lg mx-auto my-10">
            <p className="text-lg font-bold text-[var(--foreground)] mb-2">No startups found matching criteria</p>
            <p className="text-sm text-[var(--muted)] mb-4">Try clearing some filters or searching for another term.</p>
            <button
              onClick={() => { setQuery(""); setFilters(emptyFilters); }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <GsapMagnetic strength={0.3}>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl glass-card text-sm font-bold text-[var(--foreground)] hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-md"
              >
                <span>Load More Startups</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </GsapMagnetic>
          </div>
        )}
      </section>
    </div>
  );
}
