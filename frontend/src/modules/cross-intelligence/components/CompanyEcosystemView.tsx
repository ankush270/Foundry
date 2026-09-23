"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  GitBranch, ShieldCheck, AlertCircle, ExternalLink, Star, GitFork,
  CheckCircle2, Info, ChevronRight, Layers, Code2, Sparkles, Filter,
  Building2, Globe, Calendar, MapPin, Terminal, Cpu, ArrowLeft
} from "lucide-react";
import type { Startup } from "@/data/types";
import type { OssRepository } from "@/modules/githuboss/types";
import type { RepoMatch, EcosystemRelationshipType } from "../types";
import { generateCompanyEcosystemSummary, buildGithubSearchQuery, getDomainsForStartup } from "@/lib/cross-intelligence";
import { GithubService } from "@/services/github";
import { SAMPLE_OSS_REPOSITORIES } from "@/data/githuboss-repos";
import BackLink from "@/components/ui/BackLink";

interface Props {
  startup: Startup;
}

export default function CompanyEcosystemView({ startup }: Props) {
  const [liveRepos, setLiveRepos] = useState<OssRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [relationshipFilter, setRelationshipFilter] = useState<"all" | EcosystemRelationshipType>("all");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "tree">("cards");

  // Fetch live repos from GitHub for deep coverage
  useEffect(() => {
    setIsLoading(true);
    const domains = getDomainsForStartup(startup);
    const primaryDomain = domains[0] || "DevTools & Infrastructure";

    GithubService.fetchLiveRepositories({
      query: buildGithubSearchQuery(startup),
      domain: primaryDomain,
      page: 1,
      perPage: 30,
    })
      .then((result) => {
        setLiveRepos(result.repos || []);
        setIsLoading(false);
      })
      .catch(() => {
        setLiveRepos([]);
        setIsLoading(false);
      });
  }, [startup]);

  // Combine live + sample repositories and generate summary
  const summary = useMemo(() => {
    const combined = [...liveRepos, ...SAMPLE_OSS_REPOSITORIES];
    const seen = new Set<string>();
    const unique = combined.filter((r) => {
      const key = r.fullName.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return generateCompanyEcosystemSummary(startup, unique);
  }, [startup, liveRepos]);

  // Filter repos based on controls
  const displayedRepos = useMemo(() => {
    let list: RepoMatch[] = [];

    if (relationshipFilter === "all") {
      list = [...summary.officialRepos, ...summary.possiblyRelatedRepos];
    } else if (relationshipFilter === "officially_associated") {
      list = summary.officialRepos;
    } else {
      list = summary.possiblyRelatedRepos;
    }

    if (selectedTech) {
      list = list.filter((item) =>
        item.techTags?.some((t) => t.toLowerCase() === selectedTech.toLowerCase())
      );
    }

    return list;
  }, [summary, relationshipFilter, selectedTech]);

  return (
    <div className="min-h-screen pb-16 pt-4 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-6">
        
        {/* Navigation & Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <BackLink />
          <Link
            href={`/startup/${startup.slug}`}
            className="doodle-btn px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Company Profile
          </Link>
        </div>

        {/* Company Overview Header Banner */}
        <div className="doodle-card p-6 bg-[#FAF8F5] dark:bg-[#111827] space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b-2 border-dashed border-[#263D5B]/20 pb-5">
            <div className="flex items-start gap-4">
              <img
                src={startup.logo}
                alt={startup.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#263D5B] dark:border-[#49B6E5] object-contain p-2 bg-white shrink-0 shadow-[3px_3px_0px_0px_#263D5B]"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black doodle-font text-[#263D5B] dark:text-white">
                    {startup.name}
                  </h1>
                  <span className="doodle-badge text-xs bg-[#49B6E5] text-[#263D5B]">
                    {startup.batch} ({startup.year})
                  </span>
                  <span className="doodle-badge text-xs bg-emerald-500 text-white flex items-center gap-1">
                    <GitBranch className="w-3 h-3" /> Business + GitHub Ecosystem
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted)] max-w-3xl">
                  {startup.oneLiner}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[var(--muted)] flex-wrap pt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#49B6E5]" /> {startup.industries.join(", ")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#49B6E5]" /> {startup.location}
                  </span>
                  {startup.website && (
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#49B6E5] hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Count Badges */}
            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
              <div className="p-3 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 text-center min-w-[110px]">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                  {summary.totalOfficialCount}
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                  Official Repos
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-center min-w-[110px]">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono block">
                  {summary.totalRelatedCount}
                </span>
                <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">
                  Inferred Repos
                </span>
              </div>
            </div>
          </div>

          {/* Relationship Clarity Notice Banner (CRITICAL USER DIRECTIVE) */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 doodle-font text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Transparency & Relationship Notice: Fact vs. Inferred Connections</span>
            </div>
            <p>
              To maintain absolute transparency, code connections on this page are explicitly grouped into two distinct categories:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-emerald-500/40 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Officially Associated</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    First-party open source repositories published, owned, or directly maintained by {startup.name}.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-amber-500/40 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-300">Possibly Related / Open Ecosystem</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Algorithmically inferred repositories sharing domain problem overlap, architecture components, or tech stack dependencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-4 doodle-card">
          {/* Relationship Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setRelationshipFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                relationshipFilter === "all"
                  ? "bg-[#263D5B] text-white dark:bg-[#49B6E5] dark:text-[#263D5B]"
                  : "bg-slate-100 dark:bg-slate-800 text-[var(--muted)] hover:bg-slate-200"
              }`}
            >
              All Code Connections ({summary.totalOfficialCount + summary.totalRelatedCount})
            </button>

            <button
              onClick={() => setRelationshipFilter("officially_associated")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                relationshipFilter === "officially_associated"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Officially Associated ({summary.totalOfficialCount})
            </button>

            <button
              onClick={() => setRelationshipFilter("possibly_related")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                relationshipFilter === "possibly_related"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <Info className="w-3.5 h-3.5" /> Possibly Related ({summary.totalRelatedCount})
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                viewMode === "cards"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-[var(--muted)]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Repo Cards
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                viewMode === "tree"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-[var(--muted)]"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Tree View
            </button>
          </div>
        </div>

        {/* Technology Stack Filter Bar */}
        {summary.techStackBreakdown.length > 0 && (
          <div className="bg-white dark:bg-[#111827] p-4 doodle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="doodle-font font-bold text-xs text-[#263D5B] dark:text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#49B6E5]" /> Technology Stack Filter:
              </span>
              {selectedTech && (
                <button
                  onClick={() => setSelectedTech(null)}
                  className="text-[10px] text-rose-500 hover:underline font-mono font-bold"
                >
                  Clear filter ({selectedTech})
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {summary.techStackBreakdown.map((item) => (
                <button
                  key={item.name}
                  onClick={() =>
                    setSelectedTech(selectedTech === item.name ? null : item.name)
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    selectedTech === item.name
                      ? "bg-[#49B6E5] text-white shadow-sm scale-105"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#49B6E5]"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        {isLoading ? (
          <div className="p-12 text-center doodle-card bg-white dark:bg-[#111827]">
            <div className="animate-spin w-8 h-8 border-4 border-[#49B6E5] border-t-transparent rounded-full mx-auto mb-3" />
            <p className="doodle-font text-sm font-bold text-[#263D5B] dark:text-white">
              Analyzing {startup.name} open-source technology ecosystem...
            </p>
          </div>
        ) : viewMode === "tree" ? (
          /* TREE VIEW MODE */
          <div className="p-6 bg-slate-950 text-emerald-400 rounded-2xl border-2 border-[#263D5B] font-mono text-xs shadow-xl space-y-3 overflow-x-auto">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-3 text-emerald-500">
              <span className="font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Visual Ecosystem Tree Hierarchy
              </span>
              <span className="text-[10px]">Foundry Intelligence v2.6</span>
            </div>

            <pre className="leading-relaxed font-mono text-xs whitespace-pre">
{`Company: ${startup.name} (${startup.batch || 'YC Batch'})
├── Industry: ${startup.industries.join(", ")}
├── Product: ${startup.oneLiner}
│
├── Related Open Source Repositories
│   ├── Officially Associated (${summary.officialRepos.length})
${summary.officialRepos.length > 0 
  ? summary.officialRepos.map(r => `│   │   ├── 🏷️ [VERIFIED OFFICIAL] ${r.repo.fullName} (${r.repo.stars.toLocaleString()} ⭐) [${r.repo.language}]`).join("\n")
  : "│   │   └── (None detected in database)"}
│   │
│   └── Possibly Related / Open Ecosystem (${summary.possiblyRelatedRepos.length})
${summary.possiblyRelatedRepos.slice(0, 8).map((r, i, arr) => `│       ${i === arr.length - 1 ? '└──' : '├──'} 💡 [POSSIBLY RELATED] ${r.repo.fullName} (${r.repo.stars.toLocaleString()} ⭐) [${r.repo.language}]`).join("\n")}
│
└── Identified Tech Stack & Languages
${summary.techStackBreakdown.map((t, i, arr) => `${i === arr.length - 1 ? '    └──' : '    ├──'} ${t.name} (${t.category}) -> ${t.count} repo(s)`).join("\n")}
`}
            </pre>
          </div>
        ) : (
          /* CARD GRID MODE */
          <div className="space-y-4">
            {displayedRepos.length === 0 ? (
              <div className="text-center py-12 doodle-card bg-white dark:bg-[#111827]">
                <AlertCircle className="w-10 h-10 text-[var(--muted)] mx-auto mb-2" />
                <h3 className="doodle-font text-base font-bold text-[#263D5B] dark:text-white">
                  No repositories match your current filter criteria
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Try switching relationship tab or clearing tech stack selection.
                </p>
                <button
                  onClick={() => {
                    setRelationshipFilter("all");
                    setSelectedTech(null);
                  }}
                  className="mt-3 doodle-btn px-4 py-2 text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedRepos.map((item) => {
                  const isOfficial = item.relationshipType === "officially_associated";

                  return (
                    <div
                      key={item.repo.id}
                      className={`doodle-card p-5 bg-white dark:bg-[#111827] flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                        isOfficial
                          ? "border-2 border-emerald-500/60 shadow-[3px_3px_0px_0px_#10B981]"
                          : "border-2 border-[#263D5B] dark:border-slate-700"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header: Name + Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span
                              className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1.5 ${
                                isOfficial
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/40"
                              }`}
                            >
                              {isOfficial ? (
                                <>
                                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> OFFICIALLY ASSOCIATED
                                </>
                              ) : (
                                <>
                                  <Info className="w-3 h-3 text-amber-500" /> POSSIBLY RELATED
                                </>
                              )}
                            </span>

                            <h3 className="doodle-font font-black text-base text-[#263D5B] dark:text-white flex items-center gap-2">
                              <a
                                href={item.repo.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#49B6E5] hover:underline transition-colors"
                              >
                                {item.repo.fullName}
                              </a>
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                            <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                              <Star className="w-3.5 h-3.5 fill-amber-500" /> {item.repo.stars.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {item.repo.description}
                        </p>

                        {/* Relationship Verification Detail */}
                        <div
                          className={`p-2.5 rounded-xl text-[11px] font-sans leading-relaxed ${
                            isOfficial
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                              : "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          <span className="font-bold block mb-0.5">
                            {isOfficial ? "✓ Verified Relationship:" : "💡 Inferred Connection Rationale:"}
                          </span>
                          {item.officialVerificationDetails || item.matchReasons.join(" • ")}
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.repo.language && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                              {item.repo.language}
                            </span>
                          )}
                          {item.repo.sarvamExplainer?.techStack?.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-[10px] text-[var(--muted)] font-mono">
                          Updated: {new Date(item.repo.lastCommitDate || Date.now()).toLocaleDateString()}
                        </span>

                        <a
                          href={item.repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doodle-btn px-3 py-1 text-xs font-bold flex items-center gap-1 text-[#263D5B] dark:text-white hover:text-[#49B6E5]"
                        >
                          GitHub Repo <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
