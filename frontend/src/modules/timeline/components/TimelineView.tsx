"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Building2, 
  TrendingUp, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Trophy, 
  Rocket, 
  Smartphone, 
  Globe, 
  Bot, 
  Zap, 
  CheckCircle2, 
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { startups } from "@/data/startups";
import BackLink from "@/components/ui/BackLink";
import PageHeader from "@/components/ui/PageHeader";
import GsapCounter from "@/components/animations/GsapCounter";
import GsapMagnetic from "@/components/animations/GsapMagnetic";
import GsapScrollTimeline from "@/components/animations/GsapScrollTimeline";

// Tech Eras Definition
const ERAS = [
  {
    id: "pioneer",
    name: "Pioneer Era",
    years: "2005 - 2008",
    startYear: 2005,
    endYear: 2008,
    icon: Rocket,
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30",
    description: "The inception of Y Combinator, web 2.0 innovations, and early social & cloud pioneers.",
    notable: ["Reddit", "Dropbox", "Airbnb"],
  },
  {
    id: "mobile",
    name: "Mobile & Cloud Boom",
    years: "2009 - 2014",
    startYear: 2009,
    endYear: 2014,
    icon: Smartphone,
    gradient: "from-blue-500/20 to-cyan-500/20 text-blue-500 border-blue-500/30",
    description: "Smartphones, developer APIs, on-demand marketplaces, and initial fintech infrastructure.",
    notable: ["Stripe", "DoorDash", "Coinbase", "Instacart"],
  },
  {
    id: "saas",
    name: "Global & SaaS Surge",
    years: "2015 - 2020",
    startYear: 2015,
    endYear: 2020,
    icon: Globe,
    gradient: "from-purple-500/20 to-indigo-500/20 text-purple-500 border-purple-500/30",
    description: "B2B SaaS acceleration, remote tech tools, automated workflows, and global tech expansion.",
    notable: ["Scale AI", "Brex", "Supabase", "Deel", "Zapier"],
  },
  {
    id: "ai",
    name: "AI & Autonomous Tech",
    years: "2021 - 2026",
    startYear: 2021,
    endYear: 2026,
    icon: Bot,
    gradient: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30",
    description: "Generative AI models, autonomous agents, biotech breakthroughs, and next-gen developer platforms.",
    notable: ["OpenAI", "Mistral AI", "Cognition", "Perplexity"],
  },
];

// Historical contextual insights per key year
const YEAR_NARRATIVES: Record<number, string> = {
  2005: "The inaugural YC summer batch in Cambridge, MA. Paul Graham and team pioneered the modern startup accelerator format.",
  2007: "Cloud infrastructure and web utilities gained rapid traction as developer deployment tools matured.",
  2008: "Despite macro headwinds, foundational platforms in collaborative tools and consumer housing emerged.",
  2010: "The mobile app ecosystem exploded, giving rise to payments infrastructure and global consumer services.",
  2012: "Crypto, API-first developer products, and delivery logistics began transforming traditional commerce.",
  2013: "Marketplaces and logistics infrastructure saw massive capital deployment and hyper-scale adoption.",
  2016: "AI & Machine Learning start taking center stage along with B2B SaaS automation platforms.",
  2018: "Global founder teams and fintech primitives expanded across emerging international markets.",
  2020: "Remote work, asynchronous collaboration, and digital-first healthcare experienced historic growth.",
  2023: "The Generative AI revolution reached fever pitch, with foundation models and AI developer tooling dominating batches.",
  2024: "AI Agents, LLM orchestration, and vertical AI solutions became the dominant force in YC batches.",
  2025: "Autonomous robotics, multimodal agents, and specialized AI hardware startups scaled rapidly.",
  2026: "Next-gen intelligent software platforms, quantum-inspired computing, and synthetic biology leading the frontier.",
};

export default function TimelineView() {
  const years = useMemo(() => {
    const set = new Set(startups.map((s) => s.year));
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  const minYear = years[0] || 2005;
  const maxYear = years[years.length - 1] || 2026;

  const [selectedYear, setSelectedYear] = useState<number>(maxYear);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2000); // ms per year
  
  // Search & Filter state for selected year
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [onlyTopCompanies, setOnlyTopCompanies] = useState<boolean>(false);

  // Compare Mode State
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareYearA, setCompareYearA] = useState<number>(2012);
  const [compareYearB, setCompareYearB] = useState<number>(maxYear);

  // Calculate year startups
  const yearStartups = useMemo(() => startups.filter((s) => s.year === selectedYear), [selectedYear]);

  // Max startup count per year for height bar chart
  const yearCountsMap = useMemo(() => {
    const map: Record<number, number> = {};
    years.forEach((yr) => {
      map[yr] = startups.filter((s) => s.year === yr).length;
    });
    return map;
  }, [years]);

  const maxYearCount = useMemo(() => Math.max(...Object.values(yearCountsMap), 1), [yearCountsMap]);

  // Industry breakdown for selected year
  const industryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    yearStartups.forEach((s) => s.industries?.forEach((i) => { map[i] = (map[i] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [yearStartups]);

  // All available industries in selected year
  const yearIndustriesList = useMemo(() => {
    const set = new Set<string>();
    yearStartups.forEach((s) => s.industries?.forEach((i) => set.add(i)));
    return Array.from(set).sort();
  }, [yearStartups]);

  // Batch Breakdown for selected year
  const batchBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    yearStartups.forEach((s) => { map[s.batch] = (map[s.batch] || 0) + 1; });
    return Object.entries(map).sort();
  }, [yearStartups]);

  // Notable Alumni / Unicorns for selected year
  const notableUnicorns = useMemo(() => {
    return yearStartups.filter((s) => 
      s.tags?.some((t) => ["Top Company", "Unicorn", "Public Company"].includes(t)) || s.status === "Public" || s.status === "Acquired"
    ).slice(0, 4);
  }, [yearStartups]);

  // Filtered startups list
  const filteredStartups = useMemo(() => {
    return yearStartups.filter((s) => {
      const matchesSearch = 
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.oneLiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.batch.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry = selectedIndustry === "All" || s.industries?.includes(selectedIndustry);
      const matchesStatus = selectedStatus === "All" || s.status === selectedStatus;
      const matchesTop = !onlyTopCompanies || s.tags?.some((t) => ["Top Company", "Unicorn", "Public Company"].includes(t));

      return matchesSearch && matchesIndustry && matchesStatus && matchesTop;
    });
  }, [yearStartups, searchQuery, selectedIndustry, selectedStatus, onlyTopCompanies]);

  // Current Era matching selectedYear
  const currentEra = useMemo(() => {
    return ERAS.find((e) => selectedYear >= e.startYear && selectedYear <= e.endYear) || ERAS[ERAS.length - 1];
  }, [selectedYear]);

  // Auto-play time machine effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedYear((prev) => {
          const currentIndex = years.indexOf(prev);
          if (currentIndex >= years.length - 1) {
            return years[0]; // loop back
          }
          return years[currentIndex + 1];
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, years]);

  // Reset filters when year changes
  useEffect(() => {
    setSelectedIndustry("All");
    setSelectedStatus("All");
    setSearchQuery("");
  }, [selectedYear]);

  // Helper stats for compare mode
  const getCompareStats = (year: number) => {
    const list = startups.filter((s) => s.year === year);
    const active = list.filter((s) => s.status === "Active").length;
    const acquired = list.filter((s) => s.status === "Acquired").length;
    const publicCount = list.filter((s) => s.status === "Public").length;
    const inactive = list.filter((s) => s.status === "Inactive").length;
    const topCount = list.filter((s) => s.tags?.some((t) => ["Top Company", "Unicorn", "Public Company"].includes(t))).length;
    
    // Top industry
    const indMap: Record<string, number> = {};
    list.forEach((s) => s.industries?.forEach((i) => { indMap[i] = (indMap[i] || 0) + 1; }));
    const topInds = Object.entries(indMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map((e) => e[0]);

    return {
      total: list.length,
      active,
      acquired,
      publicCount,
      inactive,
      topCount,
      topInds,
      activePct: list.length ? Math.round((active / list.length) * 100) : 0,
      topStartups: list.slice(0, 3)
    };
  };

  const statsA = useMemo(() => getCompareStats(compareYearA), [compareYearA]);
  const statsB = useMemo(() => getCompareStats(compareYearB), [compareYearB]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-indigo-600/10 via-purple-500/5 to-pink-500/10 -z-10 blur-3xl pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8">
        <BackLink />
        <PageHeader
          badgeText="Historical Timeline Explorer"
          title="Startup Batch Timeline"
          subtitle="Explore Y Combinator's evolution across two decades. Scrub through years, trigger time-lapse playbacks, and compare batch eras."
        />

        {/* --- ERA QUICK NAVIGATOR CHIPS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {ERAS.map((era) => {
            const Icon = era.icon;
            const isActiveEra = selectedYear >= era.startYear && selectedYear <= era.endYear;
            return (
              <button
                key={era.id}
                onClick={() => {
                  setSelectedYear(era.startYear);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isActiveEra
                    ? "glass-card border-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-[1.01]"
                    : "glass-card border-white/10 hover:border-white/20 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl border bg-gradient-to-br ${era.gradient}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)]">
                    {era.years}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[var(--foreground)] group-hover:text-indigo-400 transition-colors">
                  {era.name}
                </h4>
                <p className="text-[11px] text-[var(--muted)] line-clamp-2 mt-1 leading-relaxed">
                  {era.description}
                </p>
                {isActiveEra && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* --- INTERACTIVE TIME MACHINE SCRUBBER & CONTROLS --- */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 mb-8 shadow-xl relative overflow-hidden">
          {/* Header & Time Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono tracking-wider uppercase text-indigo-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Interactive Time Machine
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentEra.gradient}`}>
                  {currentEra.name} ({selectedYear})
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-1">
                Drag the scrubber or click play to step through startup batch history year by year.
              </p>
            </div>

            {/* Play/Pause & Compare Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Speed toggle */}
              <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1 text-xs">
                {[
                  { label: "1x", speed: 2500 },
                  { label: "2x", speed: 1200 },
                  { label: "4x", speed: 500 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setPlaybackSpeed(s.speed)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                      playbackSpeed === s.speed
                        ? "bg-indigo-600 text-white"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Play / Pause Toggle */}
              <GsapMagnetic strength={0.2}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    isPlaying
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> Play Era
                    </>
                  )}
                </button>
              </GsapMagnetic>

              {/* Compare Mode Toggle */}
              <button
                onClick={() => setIsCompareOpen(!isCompareOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isCompareOpen
                    ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20"
                    : "glass-card border-white/10 text-[var(--foreground)] hover:border-purple-500/50"
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                {isCompareOpen ? "Close Comparison" : "Compare Years"}
              </button>
            </div>
          </div>

          {/* Startup Batch Density Height Bars */}
          <div className="relative h-16 flex items-end justify-between gap-1 mb-2 px-1">
            {years.map((year) => {
              const count = yearCountsMap[year] || 0;
              const heightPct = Math.max((count / maxYearCount) * 100, 12);
              const isSelected = year === selectedYear;

              return (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsPlaying(false);
                  }}
                  className="flex-1 group relative flex flex-col items-center justify-end h-full focus:outline-none"
                  title={`${year}: ${count} startups`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 whitespace-nowrap bg-slate-900 border border-white/20 text-white text-[10px] font-mono px-2 py-1 rounded-md shadow-xl">
                    {year}: <span className="text-indigo-400 font-bold">{count} startups</span>
                  </div>

                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-t from-indigo-600 to-pink-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                        : "bg-white/10 group-hover:bg-indigo-500/40"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Interactive Timeline Slider Rail */}
          <div className="relative px-1 mt-2">
            <div className="h-2.5 rounded-full bg-white/10 relative overflow-hidden">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                style={{
                  width: `${((selectedYear - minYear) / (maxYear - minYear)) * 100}%`,
                }}
              />
            </div>
            
            <div className="flex justify-between mt-3 overflow-x-auto pb-2 scrollbar-none" data-lenis-prevent>
              {years.map((year) => (
                <GsapMagnetic key={year} strength={0.2}>
                  <button
                    onClick={() => {
                      setSelectedYear(year);
                      setIsPlaying(false);
                    }}
                    className="flex flex-col items-center gap-1 transition-all group px-1"
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all ${
                        year === selectedYear
                          ? "bg-indigo-500 border-indigo-400 scale-150 shadow-lg shadow-indigo-500/60"
                          : year <= selectedYear
                          ? "bg-indigo-600/60 border-indigo-600/60"
                          : "bg-white/10 border-white/20 group-hover:border-indigo-400/50"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-mono transition-colors ${
                        year === selectedYear
                          ? "text-indigo-400 font-bold scale-110"
                          : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                      }`}
                    >
                      {year}
                    </span>
                  </button>
                </GsapMagnetic>
              ))}
            </div>

            <input
              type="range"
              min={minYear}
              max={maxYear}
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full mt-2 accent-indigo-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* --- COMPARE YEARS SIDE-BY-SIDE DRAWER --- */}
        <AnimatePresence>
          {isCompareOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="glass-card p-6 rounded-3xl border border-purple-500/30 bg-purple-950/10 shadow-2xl relative">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold font-display text-[var(--foreground)]">
                      Side-by-Side Batch Year Comparison
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsCompareOpen(false)}
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Selectors for Year A and Year B */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                      Compare Era A:
                    </label>
                    <select
                      value={compareYearA}
                      onChange={(e) => setCompareYearA(Number(e.target.value))}
                      className="bg-slate-900 border border-white/20 text-white font-bold text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y} ({yearCountsMap[y]} startups)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                      Compare Era B:
                    </label>
                    <select
                      value={compareYearB}
                      onChange={(e) => setCompareYearB(Number(e.target.value))}
                      className="bg-slate-900 border border-white/20 text-white font-bold text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y} ({yearCountsMap[y]} startups)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Comparative Metric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Year A Card */}
                  <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-4xl font-extrabold font-display text-indigo-400">{compareYearA}</span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {statsA.total} Startups
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                        <span className="text-[var(--muted)] text-xs">Active Survival Rate</span>
                        <span className="font-bold text-emerald-400">{statsA.activePct}% ({statsA.active})</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                        <span className="text-[var(--muted)] text-xs">Public / Acquired</span>
                        <span className="font-bold text-amber-400">{statsA.publicCount + statsA.acquired}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                        <span className="text-[var(--muted)] text-xs">Top Companies / Unicorns</span>
                        <span className="font-bold text-purple-400">{statsA.topCount}</span>
                      </div>
                      
                      <div className="pt-2">
                        <span className="text-xs text-[var(--muted)] block mb-1.5 font-semibold">Top Dominant Sectors:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {statsA.topInds.map((ind) => (
                            <span key={ind} className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Year B Card */}
                  <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-4xl font-extrabold font-display text-purple-400">{compareYearB}</span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {statsB.total} Startups
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                        <span className="text-[var(--muted)] text-xs">Active Survival Rate</span>
                        <span className="font-bold text-emerald-400">{statsB.activePct}% ({statsB.active})</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                        <span className="text-[var(--muted)] text-xs">Public / Acquired</span>
                        <span className="font-bold text-amber-400">{statsB.publicCount + statsB.acquired}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                        <span className="text-[var(--muted)] text-xs">Top Companies / Unicorns</span>
                        <span className="font-bold text-purple-400">{statsB.topCount}</span>
                      </div>
                      
                      <div className="pt-2">
                        <span className="text-xs text-[var(--muted)] block mb-1.5 font-semibold">Top Dominant Sectors:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {statsB.topInds.map((ind) => (
                            <span key={ind} className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- YEAR SUMMARY & HISTORICAL NARRATIVE --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* Year Main Stats Header Banner */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-6xl sm:text-7xl font-extrabold font-display gradient-text-indigo leading-none">
                      {selectedYear}
                    </h2>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span className="font-extrabold text-[var(--foreground)] text-2xl">
                          <GsapCounter value={yearStartups.length} />
                        </span>{" "}
                        startups recorded in YC database
                      </div>

                      {/* Batches in year badges */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {batchBreakdown.map(([batch, count]) => (
                          <span
                            key={batch}
                            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold"
                          >
                            Batch {batch}: <GsapCounter value={count} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Historical Narrative */}
                  {YEAR_NARRATIVES[selectedYear] && (
                    <p className="mt-4 text-sm text-[var(--foreground)]/80 max-w-3xl leading-relaxed italic bg-white/5 p-3.5 rounded-2xl border border-white/10">
                      💡 <span className="font-semibold text-indigo-400">Era Insight:</span> &ldquo;{YEAR_NARRATIVES[selectedYear]}&rdquo;
                    </p>
                  )}
                </div>

                {/* Status Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
                  {[
                    { label: "Active", status: "Active", color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20" },
                    { label: "Public", status: "Public", color: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20" },
                    { label: "Acquired", status: "Acquired", color: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20" },
                    { label: "Inactive", status: "Inactive", color: "from-red-500/20 to-red-500/5 text-red-400 border-red-500/20" },
                  ].map((item) => {
                    const count = yearStartups.filter((s) => s.status === item.status).length;
                    return (
                      <div
                        key={item.status}
                        className={`p-3 rounded-2xl bg-gradient-to-br border text-center ${item.color}`}
                      >
                        <p className="text-xl font-extrabold font-display">
                          <GsapCounter value={count} />
                        </p>
                        <p className="text-[10px] font-medium opacity-80 mt-0.5">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* --- NOTABLE ALUMNI SPOTLIGHT (IF ANY) --- */}
            {notableUnicorns.length > 0 && (
              <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 glass-card">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-amber-400" /> Featured Alumni & Unicorns ({selectedYear})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {notableUnicorns.map((s) => (
                    <Link
                      key={s.id}
                      href={`/startup/${s.slug}`}
                      className="p-3 rounded-2xl glass-card border border-white/10 hover:border-amber-500/50 transition-all flex items-center gap-3 group"
                    >
                      <img
                        src={s.logo}
                        alt={s.name}
                        className="w-9 h-9 rounded-xl object-contain bg-white/5 p-1 ring-1 ring-amber-500/30"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-[var(--foreground)] group-hover:text-amber-400 transition-colors truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-[var(--muted)] truncate">{s.oneLiner}</p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {s.batch}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* --- ANALYTICS & INDUSTRY BREAKDOWN --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Industry Bar Progress */}
              <div className="lg:col-span-2 rounded-3xl border border-white/10 glass-card p-6">
                <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> Industry Breakdown ({selectedYear})
                </h3>
                {industryBreakdown.length === 0 ? (
                  <p className="text-sm text-[var(--muted)] py-4">No industry data for this year.</p>
                ) : (
                  <div className="space-y-3">
                    {industryBreakdown.map(([industry, count]) => {
                      const pct = Math.round((count / yearStartups.length) * 100);
                      return (
                        <div key={industry} className="flex items-center gap-3">
                          <span className="text-xs text-[var(--muted)] w-36 truncate font-medium">{industry}</span>
                          <div className="flex-1 h-3.5 rounded-full bg-white/5 overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / yearStartups.length) * 100}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-[var(--foreground)] w-14 text-right">
                            {count} <span className="text-[10px] text-[var(--muted)] font-normal">({pct}%)</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Filters Card */}
              <div className="rounded-3xl border border-white/10 glass-card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-purple-400" /> Filter {selectedYear} Startups
                  </h3>

                  {/* Industry Dropdown */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-[var(--muted)] font-medium block mb-1">Filter Industry</label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">All Industries ({yearIndustriesList.length})</option>
                        {yearIndustriesList.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="text-[11px] text-[var(--muted)] font-medium block mb-1">Filter Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active Only</option>
                        <option value="Public">Public Only</option>
                        <option value="Acquired">Acquired Only</option>
                        <option value="Inactive">Inactive Only</option>
                      </select>
                    </div>

                    {/* Top Companies Toggle */}
                    <button
                      onClick={() => setOnlyTopCompanies(!onlyTopCompanies)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        onlyTopCompanies
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-white/5 border-white/10 text-[var(--muted)] hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" /> Unicorns / Top Companies
                      </span>
                      {onlyTopCompanies && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 text-[11px] text-[var(--muted)] flex justify-between items-center">
                  <span>Matching: <strong className="text-[var(--foreground)]">{filteredStartups.length}</strong> / {yearStartups.length}</span>
                  {(selectedIndustry !== "All" || selectedStatus !== "All" || onlyTopCompanies || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedIndustry("All");
                        setSelectedStatus("All");
                        setOnlyTopCompanies(false);
                        setSearchQuery("");
                      }}
                      className="text-indigo-400 hover:underline"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* --- STARTUP GRID FOR SELECTED YEAR --- */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-2xl font-extrabold font-display text-[var(--foreground)] flex items-center gap-2">
                Startups from {selectedYear}
                <span className="text-xs font-normal font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-[var(--muted)]">
                  {filteredStartups.length}
                </span>
              </h3>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${selectedYear} startups...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs text-[var(--foreground)] rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Animated Cards Grid */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.02 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredStartups.map((s) => (
                <motion.div
                  key={s.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                  }}
                >
                  <Link
                    href={`/startup/${s.slug}`}
                    className="timeline-startup-item flex items-center gap-3.5 p-4 rounded-2xl glass-card border border-white/10 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                  >
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="w-11 h-11 rounded-xl ring-1 ring-white/10 object-contain p-1 bg-white/5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-[var(--foreground)] group-hover:text-indigo-400 transition-colors truncate">
                          {s.name}
                        </p>
                        {s.tags?.some((t) => ["Top Company", "Unicorn", "Public Company"].includes(t)) && (
                          <span title="Top YC Startup">
                            <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--muted)] truncate mt-0.5">{s.oneLiner}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                      {s.batch}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {filteredStartups.length === 0 && (
              <div className="text-center text-[var(--muted)] py-16 glass-card rounded-3xl border border-white/10">
                <Building2 className="w-10 h-10 mx-auto opacity-30 mb-3 text-indigo-400" />
                <p className="text-base font-semibold">No startups found matching your filter criteria.</p>
                <p className="text-xs opacity-70 mt-1">Try clearing search terms or selecting a different year.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
