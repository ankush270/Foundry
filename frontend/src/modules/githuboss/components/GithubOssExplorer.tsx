"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { OssRepository, DomainCategory, TrendingDiscoveryMode } from "../types";
import { CategoryTaxonomy, SubCategory } from "../category-taxonomy";
import { GithubService } from "@/services/github";
import { RepoCard } from "./RepoCard";
import { RepoExplainerModal } from "./RepoExplainerModal";
import { SideBySideCompare } from "./SideBySideCompare";
import { LaunchRadar } from "./LaunchRadar";
import { BookmarkCollections } from "./BookmarkCollections";
import { CommunityTagsModal } from "./CommunityTagsModal";
import { TrendingCategoryBar } from "./TrendingCategoryBar";
import { 
  Search, Sparkles, Radio, ArrowRightLeft, Bookmark, 
  Filter, Code2, ShieldCheck, Zap, Layers, RefreshCw, Check,
  ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal
} from "lucide-react";

export const GithubOssExplorer: React.FC = () => {
  const searchParams = useSearchParams();
  const urlSearch = searchParams ? searchParams.get("search") : null;

  // State
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<"pull" | "push">("pull");
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory | "All">("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [activeTrendingMode, setActiveTrendingMode] = useState<TrendingDiscoveryMode>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [selectedStarRange, setSelectedStarRange] = useState<string>("All");
  const [selectedSortBy, setSelectedSortBy] = useState<"stars" | "forks" | "updated" | "relevance">("stars");
  const [selectedLicense, setSelectedLicense] = useState<string>("All");
  const [onlyUnderrated, setOnlyUnderrated] = useState(false);
  const [onlyAwesome, setOnlyAwesome] = useState(false);
  const [repos, setRepos] = useState<OssRepository[]>([]);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(60);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Live API State
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [githubToken, setGithubToken] = useState<string>(() => GithubService.getGithubToken() || "");

  // Modal State
  const [activeModalRepo, setActiveModalRepo] = useState<OssRepository | null>(null);
  const [modalTab, setModalTab] = useState<"explainer" | "integration" | "chat" | "mvp">("explainer");
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  // Comparison State
  const [compareList, setCompareList] = useState<OssRepository[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Bookmark & Tagging State
  const [bookmarkedRepoIds, setBookmarkedRepoIds] = useState<string[]>([]);
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [tagModalRepo, setTagModalRepo] = useState<OssRepository | null>(null);

  // Quick Prompt Chips
  const quickPrompts = [
    "Stock market data with pre-built signals for fintech",
    "Local LLM in browser with zero API cost",
    "Fastest serverless backend framework for Cloudflare Workers",
    "Shopify alternative for custom DTC store",
    "Medical DICOM image parser & viewer"
  ];

  // Sync Token on initial mount
  useEffect(() => {
    const activeToken = GithubService.getGithubToken();
    if (activeToken) {
      GithubService.setGithubToken(activeToken);
      setGithubToken(activeToken);
    }
  }, []);

  // Fetch Live GitHub REST API Data
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLive(true);
    setApiError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await GithubService.fetchLiveRepositories({
          query: searchQuery,
          domain: selectedDomain,
          subCategoryQuery: selectedSubCategory?.githubQuery || "",
          discoveryMode: activeTrendingMode,
          language: selectedLanguage,
          starRange: selectedStarRange,
          sortBy: selectedSortBy,
          license: selectedLicense,
          onlyUnderrated,
          onlyAwesome,
          page: currentPage,
          perPage,
        });

        if (isMounted) {
          setRepos(result.repos);
          setIsLiveApi(result.isLive);
          if (result.totalCount !== undefined) setTotalCount(result.totalCount);
          if (result.hasMore !== undefined) setHasMore(result.hasMore);
          if (result.error) {
            setApiError(result.error);
          }
        }
      } catch (err) {
        console.error("Failed live GitHub fetch:", err);
      } finally {
        if (isMounted) setIsLoadingLive(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    searchQuery,
    selectedDomain,
    selectedSubCategory,
    activeTrendingMode,
    selectedLanguage,
    selectedStarRange,
    selectedSortBy,
    selectedLicense,
    onlyUnderrated,
    onlyAwesome,
    githubToken,
    currentPage,
    perPage,
  ]);

  const handleSaveGithubToken = (e: React.FormEvent) => {
    e.preventDefault();
    GithubService.setGithubToken(githubToken);
    setIsTokenModalOpen(false);
    // Re-trigger fetch
    setSelectedDomain((prev) => prev);
  };

  // Helper to calculate active extra filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedDomain !== "All") count++;
    if (selectedLanguage !== "All") count++;
    if (selectedStarRange !== "All") count++;
    if (selectedLicense !== "All") count++;
    if (selectedSortBy !== "stars") count++;
    if (onlyUnderrated) count++;
    if (onlyAwesome) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedDomain, selectedLanguage, selectedStarRange, selectedLicense, selectedSortBy, onlyUnderrated, onlyAwesome, searchQuery]);

  const handleResetAllFilters = () => {
    setSelectedDomain("All");
    setSelectedLanguage("All");
    setSelectedStarRange("All");
    setSelectedLicense("All");
    setSelectedSortBy("stars");
    setOnlyUnderrated(false);
    setOnlyAwesome(false);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Client-side Filtering & Sorting Logic
  const filteredRepos = useMemo(() => {
    let result = repos.filter((repo) => {
      // Domain filter
      if (selectedDomain !== "All" && repo.domainCategory !== selectedDomain) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== "All") {
        const repoLang = (repo.language || "").toLowerCase();
        const targetLang = selectedLanguage.toLowerCase();
        if (targetLang === "c++" && !repoLang.includes("c++") && !repoLang.includes("cpp")) return false;
        else if (targetLang !== "c++" && !repoLang.includes(targetLang)) return false;
      }

      // License filter
      if (selectedLicense !== "All") {
        const repoLic = (repo.license || "").toLowerCase();
        const targetLic = selectedLicense.toLowerCase();
        if (!repoLic.includes(targetLic)) return false;
      }

      // Star range filter
      if (selectedStarRange !== "All") {
        const s = repo.stars;
        if (selectedStarRange === "100k+" && s < 100000) return false;
        if (selectedStarRange === "20k-100k" && (s < 20000 || s > 100000)) return false;
        if (selectedStarRange === "5k-20k" && (s < 5000 || s > 20000)) return false;
        if (selectedStarRange === "1k-5k" && (s < 1000 || s > 5000)) return false;
        if (selectedStarRange === "<1k" && s >= 1000) return false;
      }

      // Underrated filter
      if (onlyUnderrated && !repo.isUnderrated) {
        return false;
      }

      // Awesome filter
      if (onlyAwesome) {
        const fullText = (repo.name + " " + repo.description + " " + repo.tags.join(" ")).toLowerCase();
        if (!fullText.includes("awesome")) return false;
      }

      // Search Query filter
      if (searchQuery.trim() && !isLiveApi) {
        const q = searchQuery.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(q) || repo.fullName.toLowerCase().includes(q);
        const matchesDesc = repo.description.toLowerCase().includes(q);
        const matchesTags = repo.tags.some((t) => t.toLowerCase().includes(q));
        const matchesUseCases = repo.communityUseCases.some((uc) => uc.toLowerCase().includes(q));

        return matchesName || matchesDesc || matchesTags || matchesUseCases;
      }

      return true;
    });

    // Client-side Sorting (Top to bottom ordering)
    if (selectedSortBy === "forks") {
      result = [...result].sort((a, b) => b.forks - a.forks);
    } else if (selectedSortBy === "updated") {
      result = [...result].sort((a, b) => new Date(b.lastCommitDate).getTime() - new Date(a.lastCommitDate).getTime());
    } else if (selectedSortBy === "relevance") {
      result = [...result].sort((a, b) => b.qualityScore - a.qualityScore);
    } else {
      // Default: Highest Stars First (#1 Top to Bottom)
      result = [...result].sort((a, b) => b.stars - a.stars);
    }

    return result;
  }, [repos, selectedDomain, selectedLanguage, selectedLicense, selectedStarRange, selectedSortBy, onlyUnderrated, onlyAwesome, searchQuery, isLiveApi]);

  // Modal Triggers
  const handleOpenModal = (repo: OssRepository, tab: "explainer" | "integration" | "chat" | "mvp") => {
    setActiveModalRepo(repo);
    setModalTab(tab);
    setIsExplainerOpen(true);
  };

  const handleToggleCompare = (repo: OssRepository) => {
    setCompareList((prev) => {
      const exists = prev.some((r) => r.id === repo.id);
      if (exists) {
        return prev.filter((r) => r.id !== repo.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 repositories side-by-side.");
        return prev;
      }
      return [...prev, repo];
    });
  };

  const handleToggleBookmark = (repo: OssRepository) => {
    setBookmarkedRepoIds((prev) =>
      prev.includes(repo.id) ? prev.filter((id) => id !== repo.id) : [...prev, repo.id]
    );
  };

  const handleAddCommunityTag = (repoId: string, tagText: string) => {
    setRepos((prev) =>
      prev.map((r) => {
        if (r.id === repoId) {
          return {
            ...r,
            communityUseCases: [...r.communityUseCases, tagText],
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="min-h-screen text-[var(--foreground)] font-sans pb-24 space-y-8">
      {/* Top Banner & Header (In-page Hero Section) */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-8 bg-[#0D1117] text-white border-2 border-[#30363D] shadow-[6px_6px_0px_0px_#1F6FEB] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#30363D] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1F6FEB] p-0.5 shadow-lg shadow-[#1F6FEB]/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#161B22] rounded-[14px] flex items-center justify-center border border-[#30363D]">
                  <Code2 className="w-6 h-6 text-[#58A6FF]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                    GitRadar <span className="text-[#58A6FF]">GitHub OSS Discovery</span>
                  </h1>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#1F6FEB]/20 text-[#58A6FF] border border-[#1F6FEB]/40 font-semibold">
                    GitHub Ecosystem
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                  Use-case matching engine & real-time analytics for GitHub repositories
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Live GitHub REST API Status */}
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#238636]/20 text-[#3FB950] text-xs font-mono border border-[#238636]/40">
                <span className={`w-2 h-2 rounded-full ${isLiveApi ? "bg-[#3FB950] animate-pulse" : "bg-amber-500"}`} />
                <Code2 className="w-3.5 h-3.5 text-[#3FB950]" />
                <span>{isLiveApi ? "Live GitHub REST API" : "GitHub Sync (Fallback)"}</span>
              </div>

              {/* GitHub Token Config Button */}
              <button
                onClick={() => setIsTokenModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-mono border border-[#30363D] transition"
                title="Configure GitHub Personal Access Token for 5,000 requests/hour limit"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{githubToken ? "Token Saved" : "Add GitHub Token"}</span>
              </button>

              <button
                onClick={() => setIsBookmarkOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-mono border border-[#30363D] transition shadow-sm"
              >
                <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span>Saved ({bookmarkedRepoIds.length})</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#161B22] p-1.5 rounded-2xl border border-[#30363D] w-fit">
            <button
              onClick={() => setActiveMode("pull")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
                activeMode === "pull"
                  ? "bg-[#238636] text-white shadow-md shadow-[#238636]/30 border border-[#2EA043]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Pull Mode (Use-Case Search)</span>
            </button>

            <button
              onClick={() => setActiveMode("push")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
                activeMode === "push"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-purple-200" />
              <span>Push Mode (Launch Radar)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MODE 1: PULL MODE (USE-CASE SEARCH & INTELLIGENCE) */}
        {activeMode === "pull" && (
          <div className="space-y-8">
            {/* Search Input Box */}
            <div className="relative max-w-4xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe your engineering problem in plain language (e.g., 'I need stock market data with pre-built signals for fintech')..."
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/10 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none shadow-xl transition font-mono"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="text-[var(--muted)] font-mono text-[11px]">Try queries:</span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-300 border border-slate-200 dark:border-white/10 transition text-[11px] font-mono"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Trending & Open Source Discovery Category Bar */}
            <TrendingCategoryBar
              activeCategory={selectedDomain}
              activeSubCategory={selectedSubCategory}
              activeMode={activeTrendingMode}
              onSelectCategory={(cat) => {
                if (!cat) {
                  setSelectedDomain("All");
                  setSelectedSubCategory(null);
                } else {
                  setSelectedDomain(cat.name as DomainCategory);
                  setSelectedSubCategory(null);
                }
                setCurrentPage(1);
              }}
              onSelectSubCategory={(subCat) => {
                setSelectedSubCategory(subCat);
                setCurrentPage(1);
              }}
              onSelectMode={(mode) => {
                setActiveTrendingMode(mode);
                setCurrentPage(1);
              }}
              totalResultsCount={totalCount}
            />

            {/* Filter Toggle Button Bar */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setIsFilterExpanded((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition border ${
                  isFilterExpanded || activeFiltersCount > 0
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                    : "bg-slate-100 dark:bg-[#161B22] text-[var(--foreground)] border-slate-200 dark:border-[#30363D] hover:border-emerald-500"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{isFilterExpanded ? "Hide Advanced Filters" : "Show Advanced Filters & Refine"}</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                    {activeFiltersCount} active
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterExpanded ? "rotate-180" : ""}`} />
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetAllFilters}
                  className="text-xs font-mono text-[#58A6FF] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Reset All Filters ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Collapsible Multi-Attribute Filter Suite */}
            <AnimatePresence>
              {isFilterExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-black/50 border border-slate-200 dark:border-white/10 space-y-4 shadow-lg backdrop-blur-sm">
                    {/* Top Row: Vertical / Domain Categories */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1.5 font-bold">
                          <Filter className="w-3.5 h-3.5 text-emerald-500" /> Vertical Category:
                        </span>
                        {activeFiltersCount > 0 && (
                          <button
                            onClick={handleResetAllFilters}
                            className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Reset All Filters ({activeFiltersCount})</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {(
                          [
                            "All",
                            "Fintech",
                            "AI & Machine Learning",
                            "DevTools & Infrastructure",
                            "Healthtech & Bio",
                            "E-Commerce & Retail",
                            "Security & Privacy",
                            "Entertainment & Media",
                            "Gaming & Graphics",
                            "Data & Analytics",
                            "Productivity & SaaS",
                            "Web3 & Crypto",
                          ] as (DomainCategory | "All")[]
                        ).map((domain) => (
                          <button
                            key={domain}
                            onClick={() => {
                              setSelectedDomain(domain);
                              setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                              selectedDomain === domain
                                ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-500/25"
                                : "bg-white dark:bg-white/5 text-[var(--muted)] border border-slate-200 dark:border-white/10 hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/10"
                            }`}
                          >
                            {domain}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Second Row: Language Filter & Star Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-white/10">
                      {/* Language Filter */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-[var(--muted)] flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Language:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {["All", "TypeScript", "Python", "Go", "Rust", "C++", "JavaScript", "Java", "PHP", "Swift", "Kotlin", "Zig"].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                setSelectedLanguage(lang);
                                setCurrentPage(1);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                                selectedLanguage === lang
                                  ? "bg-emerald-500 text-white font-bold shadow-sm"
                                  : "bg-white dark:bg-white/5 text-[var(--muted)] border border-slate-200 dark:border-white/10 hover:text-[var(--foreground)]"
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Star Range Filter */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-[var(--muted)] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Star Range:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: "All", label: "All Stars" },
                            { id: "100k+", label: "100k+ Superstars" },
                            { id: "20k-100k", label: "20k-100k Giants" },
                            { id: "5k-20k", label: "5k-20k Popular" },
                            { id: "1k-5k", label: "1k-5k Growing" },
                            { id: "<1k", label: "<1k Early Stage" },
                          ].map((st) => (
                            <button
                              key={st.id}
                              onClick={() => {
                                setSelectedStarRange(st.id);
                                setCurrentPage(1);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                                selectedStarRange === st.id
                                  ? "bg-amber-500 text-white font-bold shadow-sm"
                                  : "bg-white dark:bg-white/5 text-[var(--muted)] border border-slate-200 dark:border-white/10 hover:text-[var(--foreground)]"
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Third Row: Sort By, License & Special Toggles */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-white/10">
                      {/* Sort By Filter */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[var(--muted)]">Sort By:</span>
                        {[
                          { id: "stars", label: "Most Stars ⭐️" },
                          { id: "forks", label: "Most Forks 🍴" },
                          { id: "updated", label: "Recently Updated ⚡" },
                          { id: "relevance", label: "Quality Score 🎯" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSortBy(s.id as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                              selectedSortBy === s.id
                                ? "bg-purple-600 text-white font-bold"
                                : "bg-white dark:bg-white/5 text-[var(--muted)] border border-slate-200 dark:border-white/10 hover:text-[var(--foreground)]"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      {/* License & Underrated Toggle */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* License Dropdown Filter */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-[var(--muted)]">License:</span>
                          {["All", "MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "AGPL-3.0"].map((lic) => (
                            <button
                              key={lic}
                              onClick={() => {
                                setSelectedLicense(lic);
                                setCurrentPage(1);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition ${
                                selectedLicense === lic
                                  ? "bg-slate-800 text-white dark:bg-white/20 font-bold"
                                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                              }`}
                            >
                              {lic}
                            </button>
                          ))}
                        </div>

                        {/* Awesome Lists Toggle */}
                        <button
                          onClick={() => {
                            setOnlyAwesome(!onlyAwesome);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition ${
                            onlyAwesome
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/40 font-semibold"
                              : "bg-white dark:bg-white/5 text-[var(--muted)] border-slate-200 dark:border-white/10 hover:text-[var(--foreground)]"
                          }`}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${onlyAwesome ? "animate-pulse text-purple-400" : ""}`} />
                          <span>😎 Awesome Lists Only</span>
                        </button>

                        {/* Underrated Repo Toggle */}
                        <button
                          onClick={() => {
                            setOnlyUnderrated(!onlyUnderrated);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition ${
                            onlyUnderrated
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 font-semibold"
                              : "bg-white dark:bg-white/5 text-[var(--muted)] border-slate-200 dark:border-white/10 hover:text-[var(--foreground)]"
                          }`}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${onlyUnderrated ? "animate-pulse text-amber-500" : ""}`} />
                          <span>Underrated Gems (&lt;2k Stars)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Grid */}
            <div>
              <div className="flex flex-col space-y-2 mb-4">
                {apiError && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-mono flex items-center justify-between">
                    <span>⚠️ {apiError}</span>
                    <button onClick={() => setIsTokenModalOpen(true)} className="font-bold hover:underline hover:text-amber-400">
                      Add Free GitHub Token
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-mono text-[var(--muted)]">
                      Showing <strong className="text-[var(--foreground)]">{filteredRepos.length}</strong> live GitHub REST API repositories
                      {totalCount > 0 && (
                        <span> out of <strong className="text-indigo-600 dark:text-cyan-400">{totalCount.toLocaleString()}</strong> total found</span>
                      )}
                      <span className="ml-1 text-xs opacity-75">(Page {currentPage})</span>
                    </h2>
                    {isLoadingLive && (
                      <span className="flex items-center gap-1.5 text-xs text-indigo-500 dark:text-cyan-400 font-mono animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching live GitHub API...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    {/* Per Page Selector */}
                    <div className="flex items-center gap-1.5 text-[var(--muted)]">
                      <span>Show per page:</span>
                      {[30, 60, 100].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setPerPage(size);
                            setCurrentPage(1);
                          }}
                          className={`px-2 py-0.5 rounded-md border text-xs ${
                            perPage === size
                              ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {activeFiltersCount > 0 && (
                      <button
                        onClick={handleResetAllFilters}
                        className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline font-semibold"
                      >
                        Reset All Filters ({activeFiltersCount})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {filteredRepos.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                  <Code2 className="w-10 h-10 text-[var(--muted)] mx-auto" />
                  <h3 className="text-base font-semibold text-[var(--foreground)]">No repositories found matching your selected filters</h3>
                  <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
                    Try loosening language, star range, or vertical filters to see more results from live GitHub REST API.
                  </p>
                  <button
                    onClick={handleResetAllFilters}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition"
                  >
                    Clear All Filters ({activeFiltersCount})
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRepos.map((repo, idx) => (
                      <RepoCard
                        key={repo.id}
                        repo={repo}
                        rank={idx + 1}
                        onOpenModal={handleOpenModal}
                        onToggleCompare={handleToggleCompare}
                        isComparing={compareList.some((r) => r.id === repo.id)}
                        onBookmark={handleToggleBookmark}
                        isBookmarked={bookmarkedRepoIds.includes(repo.id)}
                        onOpenTagModal={(r) => setTagModalRepo(r)}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                    <div className="text-xs text-[var(--muted)]">
                      Showing Page <strong className="text-[var(--foreground)]">{currentPage}</strong> ({filteredRepos.length} results displayed)
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage <= 1 || isLoadingLive}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-white/10 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                              currentPage === pageNum
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-[var(--foreground)]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={!hasMore || isLoadingLive}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs bg-indigo-600 text-white font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
                      >
                        <span>Next Page</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: PUSH MODE (LAUNCH RADAR) */}
        {activeMode === "push" && (
          <LaunchRadar onSelectDomain={(d) => setSelectedDomain(d)} />
        )}
      </main>

      {/* Sticky Compare Drawer Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-black/90 text-white border border-indigo-500/40 shadow-2xl rounded-2xl px-6 py-3.5 flex items-center gap-6 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-200">
              Comparing <strong className="text-cyan-400">{compareList.length}</strong> repos:
            </span>
            <div className="flex items-center gap-1.5">
              {compareList.map((r) => (
                <span key={r.id} className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10">
                  {r.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold text-xs transition shadow-md"
            >
              Open Comparison Matrix
            </button>
            <button
              onClick={() => setCompareList([])}
              className="p-2 text-slate-400 hover:text-white"
              title="Clear comparison"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <RepoExplainerModal
        repo={activeModalRepo}
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        initialTab={modalTab}
        userSearchQuery={searchQuery}
      />

      <SideBySideCompare
        repos={compareList}
        onRemoveRepo={(id) => setCompareList((prev) => prev.filter((r) => r.id !== id))}
        onClearAll={() => setCompareList([])}
        onClose={() => setIsCompareOpen(false)}
      />

      {isBookmarkOpen && (
        <BookmarkCollections
          bookmarkedRepos={repos.filter((r) => bookmarkedRepoIds.includes(r.id))}
          onRemoveBookmark={(id) => setBookmarkedRepoIds((prev) => prev.filter((item) => item !== id))}
          onClose={() => setIsBookmarkOpen(false)}
        />
      )}

      <CommunityTagsModal
        repo={tagModalRepo}
        isOpen={!!tagModalRepo}
        onClose={() => setTagModalRepo(null)}
        onAddTag={handleAddCommunityTag}
      />

      {/* GitHub Access Token Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" data-lenis-prevent>
          <div className="relative w-full max-w-md bg-slate-900 dark:bg-[#070A11] border border-slate-700 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">GitHub API Rate Limit Config</h3>
              </div>
              <button onClick={() => setIsTokenModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              GitRadar uses <strong>GitHub's official REST API</strong>. Unauthenticated searches are limited to 10 req/min.
              Add a free <strong>GitHub Personal Access Token (classic or fine-grained)</strong> to unlock <strong>5,000 requests/hour</strong>.
            </p>

            <form onSubmit={handleSaveGithubToken} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
                  GitHub Personal Access Token (github_pat_... or ghp_...)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    GithubService.setGithubToken("");
                    setGithubToken("");
                    setIsTokenModalOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  Clear Token
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                >
                  Save Token & Refresh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
