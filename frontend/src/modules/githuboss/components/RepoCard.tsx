"use client";

import React from "react";
import { OssRepository } from "../types";
import { GithubService } from "@/services/github";
import { 
  Star, GitFork, Lightbulb, Cpu, Code2, Rocket, ArrowRightLeft, 
  Tag, Layers, Calendar, ExternalLink
} from "lucide-react";

interface RepoCardProps {
  repo: OssRepository;
  rank?: number;
  onOpenModal: (repo: OssRepository, activeTab: "explainer" | "integration" | "chat" | "mvp") => void;
  onToggleCompare: (repo: OssRepository) => void;
  isComparing: boolean;
  onBookmark: (repo: OssRepository) => void;
  isBookmarked: boolean;
  onOpenTagModal: (repo: OssRepository) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  rank,
  onOpenModal,
  onToggleCompare,
  isComparing,
  onBookmark,
  isBookmarked,
  onOpenTagModal,
}) => {
  const [isDescExpanded, setIsDescExpanded] = React.useState(false);
  const [isInsightExpanded, setIsInsightExpanded] = React.useState(false);

  const badgeStyle = GithubService.getScoreBadgeStyle(repo.qualityScore);

  // Format date nicely (e.g. "Pushed Sep 2026")
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="group relative rounded-2xl glass-card border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 p-5 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden bg-white/70 dark:bg-black/40 backdrop-blur-md">
      <div>
        {/* Top Header Row: Owner Avatar, Title, Language & Quality Score */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          {/* Avatar & Repo Info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {rank !== undefined && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-600/90 text-white text-[10px] font-mono font-extrabold shrink-0 shadow-sm">
                #{rank}
              </span>
            )}
            <img 
              src={repo.avatarUrl} 
              alt={repo.owner} 
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 object-cover bg-slate-100 dark:bg-white/5 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <a 
                href={repo.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-base text-[var(--foreground)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1 truncate"
                title={repo.fullName}
              >
                <span className="truncate">{repo.name}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
              <p className="text-xs text-[var(--muted)] font-mono truncate">{repo.owner}</p>
            </div>
          </div>

          {/* Badges Column: Quality Score, Relevance & Language */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {/* Relevance Match Badge */}
            {repo.relevanceMatchBadge && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-mono font-bold whitespace-nowrap">
                {repo.relevanceMatchBadge}
              </span>
            )}

            {/* Quality Score Badge */}
            <div 
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border} whitespace-nowrap shadow-sm`}
              title="Quality Score calculated from stars, maintainer activity, issue resolution ratio, and velocity"
            >
              <span>Score {repo.qualityScore}</span>
            </div>

            {/* Language Badge */}
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[11px] font-mono text-[var(--muted)] border border-slate-200 dark:border-white/10 whitespace-nowrap">
              {repo.language}
            </span>
          </div>
        </div>

        {/* Repository Description */}
        <div className="mb-3 font-sans text-xs sm:text-sm text-[var(--foreground)] opacity-85 leading-relaxed break-words min-h-[2.5rem]">
          <p className={isDescExpanded ? "" : "line-clamp-2"}>
            {repo.description}
          </p>
          {repo.description && repo.description.length > 70 && (
            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline font-mono inline-flex items-center gap-0.5"
            >
              {isDescExpanded ? "Show Less" : "Read More..."}
            </button>
          )}
        </div>

        {/* Sarvam AI Explainer Highlight */}
        <div className="rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/15 dark:border-emerald-800/30 p-2.5 mb-3">
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
              <span>Solution Insight</span>
            </div>
            {repo.sarvamExplainer.whatItSolves && repo.sarvamExplainer.whatItSolves.length > 70 && (
              <button
                onClick={() => setIsInsightExpanded(!isInsightExpanded)}
                className="text-[10px] font-mono hover:underline text-emerald-500 dark:text-emerald-300"
              >
                {isInsightExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
          <p className={`text-xs text-[var(--foreground)] opacity-80 leading-relaxed break-words ${isInsightExpanded ? "" : "line-clamp-2"}`}>
            {repo.sarvamExplainer.whatItSolves}
          </p>
        </div>

        {/* Key Important Information Stats Grid */}
        <div className="grid grid-cols-4 gap-1 py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-[var(--muted)] mb-3">
          <div className="flex items-center gap-1 min-w-0" title="GitHub Stargazers">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500/20 shrink-0" />
            <span className="truncate font-semibold text-[var(--foreground)]">{repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}</span>
          </div>

          <div className="flex items-center gap-1 min-w-0" title="GitHub Forks">
            <GitFork className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks}</span>
          </div>

          <div className="flex items-center gap-1 min-w-0" title="Open Source License">
            <span className="truncate font-semibold text-[var(--foreground)]">{repo.license}</span>
          </div>

          <div className="flex items-center gap-1 justify-end min-w-0" title="Monthly Commit Velocity">
            <span className="truncate text-emerald-600 dark:text-emerald-400 font-bold">{repo.monthlyCommitVelocity}/mo</span>
          </div>
        </div>

        {/* Topics / Tags Row */}
        <div className="flex flex-wrap items-center gap-1 mb-4 min-h-[1.75rem]">
          {repo.tags && repo.tags.length > 0 ? (
            repo.tags.slice(0, 4).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[var(--muted)] border border-slate-200 dark:border-white/10 truncate max-w-[120px]"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-mono text-[var(--muted)]">#{repo.domainCategory.toLowerCase()}</span>
          )}
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-2 gap-2">
          {/* Plain Explainer Button */}
          <button
            onClick={() => onOpenModal(repo, "explainer")}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition truncate"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Explainer</span>
          </button>

          {/* Ask-a-Question Q&A Chat */}
          <button
            onClick={() => onOpenModal(repo, "chat")}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold border border-purple-500/20 transition truncate"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
            <span className="truncate">Ask Q&A</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* Integration Guide */}
          <button
            onClick={() => onOpenModal(repo, "integration")}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[var(--foreground)] text-[11px] font-mono border border-slate-200 dark:border-white/10 transition truncate"
          >
            <Layers className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">Setup</span>
          </button>

          {/* MVP Pathway */}
          <button
            onClick={() => onOpenModal(repo, "mvp")}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[var(--foreground)] text-[11px] font-mono border border-slate-200 dark:border-white/10 transition truncate"
          >
            <Rocket className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="truncate">Build MVP</span>
          </button>

          {/* Compare Toggle */}
          <button
            onClick={() => onToggleCompare(repo)}
            className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-mono border transition truncate ${
              isComparing
                ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[var(--foreground)] border-slate-200 dark:border-white/10"
            }`}
          >
            <ArrowRightLeft className="w-3 h-3 shrink-0" />
            <span className="truncate">{isComparing ? "Added" : "Compare"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

