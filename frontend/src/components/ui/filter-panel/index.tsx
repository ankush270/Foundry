"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Filter,
  ArrowUpDown,
  Briefcase,
  Sparkles,
  Search,
  Building2,
  Rocket,
  Tag,
  Calendar,
  Globe,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import {
  getAllIndustries,
  getAllBatches,
  getAllStatuses,
  getAllCountries,
  getAllFundingStages,
  getTopTags
} from "@/lib/utils";
import type { Filters } from "@/data/types";
import { emptyFilters } from "@/data/types";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  totalFilteredCount?: number;
}

type TabType = "industries" | "stage" | "tags" | "batches" | "countries";

export default function FilterPanel({ filters, onChange, totalFilteredCount }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("industries");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and pause Lenis when modal is open
  useEffect(() => {
    const lenis = typeof window !== "undefined" ? (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis : null;
    if (open) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "unset";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "unset";
      lenis?.start();
    };
  }, [open]);

  const industries = getAllIndustries();
  const batches = getAllBatches();
  const statuses = getAllStatuses();
  const countries = getAllCountries();
  const fundingStages = getAllFundingStages();
  const topTags = getTopTags();

  const toggleArrayItem = (
    key: keyof Pick<Filters, "industries" | "batches" | "statuses" | "countries" | "tags" | "fundingStages">,
    item: string
  ) => {
    const current = filters[key] || [];
    const next = current.includes(item) ? current.filter((x) => x !== item) : [...current, item];
    onChange({ ...filters, [key]: next });
  };

  const activeCount =
    (filters.industries?.length || 0) +
    (filters.batches?.length || 0) +
    (filters.statuses?.length || 0) +
    (filters.countries?.length || 0) +
    (filters.tags?.length || 0) +
    (filters.fundingStages?.length || 0) +
    (filters.hasAI !== null ? 1 : 0) +
    (filters.isHiring !== null ? 1 : 0) +
    (filters.sortBy !== "relevance" ? 1 : 0);

  // Filtered lists based on search inside tab
  const filteredIndustries = useMemo(
    () => industries.filter((i) => i.toLowerCase().includes(searchTerm.toLowerCase())),
    [industries, searchTerm]
  );

  const filteredCountries = useMemo(
    () => countries.filter((c) => c.toLowerCase().includes(searchTerm.toLowerCase())),
    [countries, searchTerm]
  );

  const filteredBatches = useMemo(
    () => batches.filter((b) => b.toLowerCase().includes(searchTerm.toLowerCase())),
    [batches, searchTerm]
  );

  const filteredTags = useMemo(
    () => topTags.filter((t) => t.toLowerCase().includes(searchTerm.toLowerCase())),
    [topTags, searchTerm]
  );

  const tabs = [
    {
      id: "industries" as TabType,
      label: "Industries & Domain",
      icon: Building2,
      count: filters.industries?.length || 0,
    },
    {
      id: "stage" as TabType,
      label: "Stage & Status",
      icon: Rocket,
      count: (filters.fundingStages?.length || 0) + (filters.statuses?.length || 0) + (filters.isHiring !== null ? 1 : 0) + (filters.hasAI !== null ? 1 : 0),
    },
    {
      id: "tags" as TabType,
      label: "Popular Tags",
      icon: Tag,
      count: filters.tags?.length || 0,
    },
    {
      id: "batches" as TabType,
      label: "YC Batches",
      icon: Calendar,
      count: filters.batches?.length || 0,
    },
    {
      id: "countries" as TabType,
      label: "Location & Country",
      icon: Globe,
      count: filters.countries?.length || 0,
    },
  ];

  // Render Portal Modal content
  const modalContent = open && mounted ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
      data-lenis-prevent
    >
      <div
        className="w-full max-w-4xl h-[85vh] sm:h-[620px] max-h-[90vh] rounded-3xl border border-white/15 bg-[#0F1626] text-white shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6600]/20 border border-[#FF6600]/40 flex items-center justify-center text-[#FF6600]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-display leading-tight text-white">Filter YC Startups</h2>
              <p className="text-xs text-slate-400">Refine companies by domain, funding stage, batch, and tags</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={() => onChange(emptyFilters)}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear All ({activeCount})
              </button>
            )}

            <button
              onClick={() => { setOpen(false); setSearchTerm(""); }}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar + Main Content Grid */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar Navigation */}
          <div
            className="w-full md:w-64 border-r border-white/10 bg-black/20 p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col"
            data-lenis-prevent
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#FF6600] to-[#FF3D00] text-white shadow-md shadow-[#FF6600]/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count > 0 && (
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                        active ? "bg-white text-[#FF6600]" : "bg-[#FF6600] text-white"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 flex flex-col p-5 bg-[#0F1626]/50 overflow-hidden">
            {/* Search inside Tab */}
            {(activeTab === "industries" || activeTab === "countries" || activeTab === "batches" || activeTab === "tags") && (
              <div className="relative mb-3 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6600]/50 transition-all"
                />
              </div>
            )}

            {/* Tab Content Box */}
            <div
              className="flex-1 overflow-y-auto h-[420px] max-h-[420px] pr-2 pb-10 custom-scrollbar"
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
            >
              {/* TAB 1: INDUSTRIES */}
              {activeTab === "industries" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {filteredIndustries.map((ind) => {
                    const selected = filters.industries?.includes(ind);
                    return (
                      <button
                        key={ind}
                        onClick={() => toggleArrayItem("industries", ind)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          selected
                            ? "bg-[#FF6600]/20 text-[#FF6600] border-[#FF6600]/50 shadow-sm"
                            : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-[#FF6600]" />}
                        <span>{ind}</span>
                      </button>
                    );
                  })}
                  {filteredIndustries.length === 0 && (
                    <p className="text-xs text-slate-400 py-4">No matching industries found.</p>
                  )}
                </div>
              )}

              {/* TAB 2: STAGE & STATUS */}
              {activeTab === "stage" && (
                <div className="space-y-6">
                  {/* Funding Stage */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                      Funding Stage
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {fundingStages.map((stage) => {
                        const selected = filters.fundingStages?.includes(stage);
                        return (
                          <button
                            key={stage}
                            onClick={() => toggleArrayItem("fundingStages", stage)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                              selected
                                ? "bg-[#FF6600]/20 text-[#FF6600] border-[#FF6600]/50 shadow-sm"
                                : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5 text-[#FF6600]" />}
                            <span>{stage}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Company Status */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                      Company Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => {
                        const selected = filters.statuses?.includes(status);
                        return (
                          <button
                            key={status}
                            onClick={() => toggleArrayItem("statuses", status)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                              selected
                                ? "bg-[#FF6600]/20 text-[#FF6600] border-[#FF6600]/50 shadow-sm"
                                : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5 text-[#FF6600]" />}
                            <span>{status}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Special Flags */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                      Hiring & Technology Flags
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => onChange({ ...filters, isHiring: filters.isHiring === true ? null : true })}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          filters.isHiring === true
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                            : "border-white/10 text-slate-300 hover:text-emerald-400"
                        }`}
                      >
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        <span>Actively Hiring Roles</span>
                      </button>

                      <button
                        onClick={() => onChange({ ...filters, hasAI: filters.hasAI === true ? null : true })}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          filters.hasAI === true
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                            : "border-white/10 text-slate-300 hover:text-cyan-400"
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>AI & Machine Learning</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: POPULAR TAGS */}
              {activeTab === "tags" && (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map((tag) => {
                    const selected = filters.tags?.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleArrayItem("tags", tag)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          selected
                            ? "bg-[#FF6600]/20 text-[#FF6600] border-[#FF6600]/50 shadow-sm"
                            : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-[#FF6600]" />}
                        <span>#{tag}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: YC BATCHES */}
              {activeTab === "batches" && (
                <div className="flex flex-wrap gap-2">
                  {filteredBatches.map((batch) => {
                    const selected = filters.batches?.includes(batch);
                    return (
                      <button
                        key={batch}
                        onClick={() => toggleArrayItem("batches", batch)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selected
                            ? "bg-[#FF6600]/20 text-[#FF6600] border-[#FF6600]/50 shadow-sm"
                            : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-[#FF6600]" />}
                        <span>{batch}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 5: LOCATIONS / COUNTRIES */}
              {activeTab === "countries" && (
                <div className="flex flex-wrap gap-2">
                  {filteredCountries.map((country) => {
                    const selected = filters.countries?.includes(country);
                    return (
                      <button
                        key={country}
                        onClick={() => toggleArrayItem("countries", country)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          selected
                            ? "bg-[#FF6600]/20 text-[#FF6600] border-[#FF6600]/50 shadow-sm"
                            : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-[#FF6600]" />}
                        <span>{country}</span>
                      </button>
                    );
                  })}
                  {filteredCountries.length === 0 && (
                    <p className="text-xs text-slate-400 py-4">No matching countries found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {activeCount > 0 ? (
              <span className="text-[#FF6600] font-bold">{activeCount} active filter criteria applied</span>
            ) : (
              <span>No active filters selected</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#FF3D00] text-white text-xs font-bold shadow-lg shadow-[#FF6600]/30 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span>Apply Filters</span>
              {totalFilteredCount !== undefined && (
                <span className="bg-black/30 px-2 py-0.5 rounded-md text-[11px]">
                  {totalFilteredCount} Startups
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="w-full">
      {/* Quick Action Control Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap glass-card p-2.5 rounded-2xl border border-[var(--border-color)] shadow-md">
        {/* Left Pills & Trigger Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Modal Trigger Button */}
          <button
            onClick={() => setOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
              activeCount > 0
                ? "bg-gradient-to-r from-[#FF6600] to-[#FF3D00] text-white shadow-[#FF6600]/30 ring-2 ring-[#FF6600]/40"
                : "bg-slate-900 text-white dark:bg-white/10 dark:text-white hover:bg-[#FF6600] hover:text-white border border-slate-700 dark:border-white/15"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-white" />
            <span className="font-bold text-white">All Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#FF6600] text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                {activeCount}
              </span>
            )}
          </button>

          {/* Quick Filter Pill: Hiring */}
          <button
            onClick={() => onChange({ ...filters, isHiring: filters.isHiring === true ? null : true })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filters.isHiring === true
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-sm"
                : "border-[var(--border-color)] text-[var(--foreground)] hover:text-emerald-500 hover:border-emerald-500/30"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            Hiring Only
          </button>

          {/* Quick Filter Pill: AI */}
          <button
            onClick={() => onChange({ ...filters, hasAI: filters.hasAI === true ? null : true })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filters.hasAI === true
                ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 shadow-sm"
                : "border-[var(--border-color)] text-[var(--foreground)] hover:text-cyan-500 hover:border-cyan-500/30"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            AI Companies
          </button>

          {/* Quick Filter Pill: Unicorn */}
          <button
            onClick={() => toggleArrayItem("tags", "Unicorn")}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filters.tags?.includes("Unicorn")
                ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/40 shadow-sm"
                : "border-[var(--border-color)] text-[var(--foreground)] hover:text-purple-500 hover:border-purple-500/30"
            }`}
          >
            🦄 Unicorns
          </button>
        </div>

        {/* Right Side: Sort Selector & Reset */}
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={() => onChange(emptyFilters)}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FF6600]" />
            <select
              value={filters.sortBy || "relevance"}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent text-xs font-bold text-[var(--foreground)] border-none focus:outline-none cursor-pointer pr-1"
            >
              <option value="relevance" className="bg-[#0F1626] text-white">Sort: Relevance</option>
              <option value="name-asc" className="bg-[#0F1626] text-white">Name (A-Z)</option>
              <option value="name-desc" className="bg-[#0F1626] text-white">Name (Z-A)</option>
              <option value="year-desc" className="bg-[#0F1626] text-white">Newest Batch</option>
              <option value="year-asc" className="bg-[#0F1626] text-white">Oldest Batch</option>
              <option value="team-desc" className="bg-[#0F1626] text-white">Team Size</option>
              <option value="jobs-desc" className="bg-[#0F1626] text-white">Job Openings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Render Modal via React Portal */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </div>
  );
}
