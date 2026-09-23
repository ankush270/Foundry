"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X, Star, GitFork, ExternalLink, Sparkles, Code2,
  Rocket, Layers, Search, Zap, ArrowRight, ChevronDown,
  ChevronUp, Copy, Check, AlertTriangle, TrendingUp
} from "lucide-react";
import type { Startup } from "@/data/types";
import type { OssRepository } from "@/modules/githuboss/types";
import type { RepoMatch, StackLayer, TechStackRecommendation } from "../types";
import { generateTechStackRecommendation, buildGithubSearchQuery, getDomainsForStartup } from "@/lib/cross-intelligence";
import { GithubService } from "@/services/github";
import { SAMPLE_OSS_REPOSITORIES } from "@/data/githuboss-repos";

interface Props {
  startup: Startup;
  isOpen?: boolean;
  onClose?: () => void;
  embedded?: boolean;
}

type ViewTab = "overview" | "build-with" | "same-problem";

export default function TechStackLinker({ startup, isOpen = true, onClose, embedded = false }: Props) {
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
  const [liveRepos, setLiveRepos] = useState<OssRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [expandedRepoIds, setExpandedRepoIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRepoIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch live repos from GitHub based on startup profile
  useEffect(() => {
    if (!embedded && !isOpen) return;
    setIsLoading(true);

    const domains = getDomainsForStartup(startup);
    const primaryDomain = domains[0] || "DevTools & Infrastructure";

    GithubService.fetchLiveRepositories({
      query: buildGithubSearchQuery(startup),
      domain: primaryDomain,
      page: 1,
      perPage: 40,
    }).then((result) => {
      setLiveRepos(result.repos);
      setIsLive(result.isLive);
      setIsLoading(false);
    }).catch(() => {
      setLiveRepos([]);
      setIsLoading(false);
    });
  }, [embedded, isOpen, startup]);

  // Generate recommendation combining live + curated repos
  const recommendation = useMemo<TechStackRecommendation | null>(() => {
    const allRepos = [...liveRepos, ...SAMPLE_OSS_REPOSITORIES];
    const seen = new Set<string>();
    const unique = allRepos.filter(r => {
      const key = r.fullName.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return generateTechStackRecommendation(startup, unique);
  }, [startup, liveRepos]);

  const handleCopyInstall = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (!embedded && !isOpen) return null;

  const tabs: { id: ViewTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Top Matches", icon: Sparkles, count: recommendation?.topRepos.length },
    { id: "build-with", label: "Build Stack", icon: Layers, count: recommendation?.buildWithRepos.length },
    { id: "same-problem", label: "Same Problem", icon: AlertTriangle, count: recommendation?.sameProblemRepos.length },
  ];

  const mainContent = (
    <div className="space-y-4">
      {/* Header & Tech Meta */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-dashed border-[#263D5B]/20 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={startup.logo}
            alt={startup.name}
            className="w-10 h-10 rounded-xl border-2 border-[#263D5B] dark:border-[#49B6E5] object-contain p-1 bg-white shrink-0 shadow-[2px_2px_0px_0px_#263D5B]"
          />
          <div>
            <h2 className="doodle-font font-black text-lg text-[#263D5B] dark:text-white flex items-center gap-2">
              <span>{startup.name}</span>
              <span className="text-[#49B6E5]">×</span>
              <span className="text-emerald-500">Open Source Tech Stack</span>
            </h2>
            <p className="text-xs text-[var(--muted)] line-clamp-1">{startup.oneLiner}</p>
          </div>
        </div>

        {!embedded && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Meta Stats Row */}
      {recommendation && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#49B6E5]/10 border border-[#49B6E5]/30 text-center">
            <span className="text-[10px] font-mono font-bold text-[#49B6E5] uppercase block">Matched Repos</span>
            <span className="doodle-font font-black text-sm text-[#263D5B] dark:text-white">{recommendation.topRepos.length} Repositories</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase block">Build Est.</span>
            <span className="doodle-font font-black text-sm text-[#263D5B] dark:text-white">{recommendation.estimatedBuildTime}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">Difficulty</span>
            <span className="doodle-font font-black text-sm text-[#263D5B] dark:text-white">{recommendation.difficultyLevel || "Intermediate"}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center">
            <span className="text-[10px] font-mono font-bold text-violet-500 uppercase block">Data Status</span>
            <span className="doodle-font font-black text-sm text-[#263D5B] dark:text-white">{isLive ? "⚡ Live GitHub Sync" : "Curated Stack"}</span>
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold doodle-font transition-all ${
                active
                  ? "bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                  : "text-[var(--muted)] hover:text-[#263D5B] dark:hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {typeof tab.count === "number" && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-[#263D5B] dark:text-white font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-4 border-[#49B6E5] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[var(--muted)] doodle-font">Analyzing GitHub open source repositories for {startup.name}...</p>
        </div>
      )}

      {/* Tab Content: Top Matches */}
      {!isLoading && activeTab === "overview" && recommendation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recommendation.topRepos.map((match) => {
            const isExpanded = !!expandedRepoIds[match.repo.id];
            const isLong = match.repo.description && match.repo.description.length > 90;
            const targetUrl = match.repo.repoUrl || (match.repo as any).url || `https://github.com/${match.repo.fullName}`;
            return (
              <div key={match.repo.id} className="doodle-card p-4 bg-white dark:bg-[#111827] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doodle-font font-black text-sm text-[#263D5B] dark:text-white hover:text-[#49B6E5] hover:underline transition-colors flex items-center gap-1 truncate"
                        >
                          {match.repo.fullName} <ExternalLink className="w-3.5 h-3.5 text-[#49B6E5] shrink-0" />
                        </a>
                        {match.repo.language && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-[var(--muted)] border border-slate-200 dark:border-slate-700">
                            {match.repo.language}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs text-[var(--muted)] mt-1 ${isExpanded ? "" : "line-clamp-2"}`}>
                        {match.repo.description}
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(match.repo.id)}
                          className="text-[11px] font-bold text-[#49B6E5] hover:underline mt-0.5 inline-block"
                        >
                          {isExpanded ? "Read Less ▲" : "Read More ▼"}
                        </button>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="doodle-badge text-[10px] bg-emerald-500 text-white px-2 py-0.5 font-bold">
                        {match.relevanceScore}% Match
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--muted)] mt-1 justify-end">
                        <span>⭐ {(match.repo.stars / 1000).toFixed(1)}k</span>
                        <span>🍴 {(match.repo.forks / 1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  </div>

                  {/* Match reasons */}
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {match.matchReasons.map((reason, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        ⚡ {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick MVP pathway & Direct GitHub Link */}
                <div className="space-y-2 mt-auto">
                  {(match as { mvpPathway?: string }).mvpPathway && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-0.5">
                      <div className="font-bold doodle-font text-[#263D5B] dark:text-[#49B6E5]">🚀 MVP Integration:</div>
                      <p className={`text-[var(--muted)] ${isExpanded ? "" : "line-clamp-2"}`}>{(match as { mvpPathway?: string }).mvpPathway}</p>
                    </div>
                  )}
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full doodle-btn py-1.5 px-3 text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-[#49B6E5] hover:text-[#263D5B] text-[#263D5B] dark:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Open Repository on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Build Stack (Organized by Layer) */}
      {!isLoading && activeTab === "build-with" && recommendation && (
        <div className="space-y-5">
          {recommendation.buildWithRepos.map((layerGroup) => (
            <div key={layerGroup.layer} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="doodle-badge text-xs bg-[#49B6E5] text-[#263D5B] font-extrabold uppercase">
                  {layerGroup.label} Layer
                </span>
                <span className="text-xs text-[var(--muted)] font-medium">({layerGroup.description})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {layerGroup.repos.map((match) => {
                  const isExpanded = !!expandedRepoIds[match.repo.id];
                  const isLong = match.repo.description && match.repo.description.length > 90;
                  const targetUrl = match.repo.repoUrl || (match.repo as any).url || `https://github.com/${match.repo.fullName}`;
                  return (
                    <div key={match.repo.id} className="doodle-card p-4 bg-white dark:bg-[#111827] flex flex-col justify-between space-y-2">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="doodle-font font-extrabold text-xs sm:text-sm text-[#263D5B] dark:text-white hover:text-[#49B6E5] hover:underline flex items-center gap-1"
                          >
                            {match.repo.fullName} <ExternalLink className="w-3.5 h-3.5 text-[#49B6E5] shrink-0" />
                          </a>
                          <span className="doodle-badge text-[10px] bg-[#49B6E5] text-[#263D5B] font-bold shrink-0">
                            {match.relevanceScore}% Match
                          </span>
                        </div>
                        <p className={`text-xs text-[var(--muted)] ${isExpanded ? "" : "line-clamp-2"}`}>
                          {match.repo.description}
                        </p>
                        {isLong && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(match.repo.id)}
                            className="text-[11px] font-bold text-[#49B6E5] hover:underline"
                          >
                            {isExpanded ? "Read Less ▲" : "Read More ▼"}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)] pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>⭐ {(match.repo.stars / 1000).toFixed(1)}k stars</span>
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#49B6E5] hover:underline flex items-center gap-1"
                        >
                          View GitHub <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Same Problem */}
      {!isLoading && activeTab === "same-problem" && recommendation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recommendation.sameProblemRepos.map((match) => {
            const isExpanded = !!expandedRepoIds[match.repo.id];
            const isLong = match.repo.description && match.repo.description.length > 90;
            const targetUrl = match.repo.repoUrl || (match.repo as any).url || `https://github.com/${match.repo.fullName}`;
            return (
              <div key={match.repo.id} className="doodle-card p-4 bg-white dark:bg-[#111827] flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doodle-font font-extrabold text-xs sm:text-sm text-[#263D5B] dark:text-white hover:text-[#49B6E5] hover:underline flex items-center gap-1"
                    >
                      {match.repo.fullName} <ExternalLink className="w-3.5 h-3.5 text-[#49B6E5] shrink-0" />
                    </a>
                    <span className="doodle-badge text-[10px] bg-[#D97706] text-white font-bold shrink-0">
                      {match.relevanceScore}% Match
                    </span>
                  </div>
                  <p className={`text-xs text-[var(--muted)] ${isExpanded ? "" : "line-clamp-2"}`}>
                    {match.repo.description}
                  </p>
                  {isLong && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(match.repo.id)}
                      className="text-[11px] font-bold text-[#49B6E5] hover:underline"
                    >
                      {isExpanded ? "Read Less ▲" : "Read More ▼"}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)] pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>⭐ {(match.repo.stars / 1000).toFixed(1)}k stars</span>
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#49B6E5] hover:underline flex items-center gap-1"
                  >
                    View GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="w-full doodle-card p-5 sm:p-6 bg-white dark:bg-[#1F2937]">
        {mainContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" data-lenis-prevent onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1F2937] border-4 border-[#263D5B] dark:border-[#49B6E5] rounded-3xl shadow-2xl p-5 sm:p-6 overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {mainContent}
      </div>
    </div>
  );
}
