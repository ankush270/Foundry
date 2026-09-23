"use client";

import { useState, useEffect } from "react";
import { TechNewsItem } from "@/modules/technews/types";
import {
  X,
  BookOpen,
  Building2,
  Cpu,
  TrendingUp,
  Code2,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  Flame,
  Zap,
  Sparkles,
  Briefcase,
  Globe,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TechNewsDetailModalProps {
  item: TechNewsItem | null;
  onClose: () => void;
}

export default function TechNewsDetailModal({ item, onClose }: TechNewsDetailModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "breakdown" | "technology" | "impact" | "opportunities" | "repos" | "skills"
  >("breakdown");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Lock body scroll when modal is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item) return null;

  const { breakdown } = item;

  const getSourceDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return item.source.name;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white">
                {item.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3" /> {item.impactLevel} Impact
              </span>
              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 transition-colors"
                title="Verify original live article"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verified Source: {getSourceDomain(item.source.url)} ↗
              </a>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Strategic Tab Navigation Bar */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: "breakdown", label: "Foundry Core", icon: BookOpen },
            { id: "technology", label: "Tech & Architecture", icon: Cpu },
            { id: "impact", label: "Market & DX Impact", icon: TrendingUp },
            { id: "opportunities", label: "Startup White-Space", icon: Lightbulb, badge: breakdown.startupOpportunities.length },
            ...(breakdown.openSourceProjects && breakdown.openSourceProjects.length > 0
              ? [{ id: "repos", label: "Open Source Repos", icon: Code2, badge: breakdown.openSourceProjects.length }]
              : []),
            { id: "skills", label: "Jobs & Skills", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  active
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body with data-lenis-prevent */}
        <div
          className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 scrollbar-thin min-h-0"
          data-lenis-prevent
        >
          {/* TAB 1: Foundry Core Breakdown */}
          {activeTab === "breakdown" && (
            <div className="space-y-6">
              {/* Live Source Verification Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-World Live Article Verified on <strong>{item.source.name}</strong></span>
                </div>
                <a
                  href={item.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all"
                >
                  Verify Original Source Article <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Premise Callout Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800/50">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Strategic Premise / Core Thesis
                </h4>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {item.premise}
                </p>
              </div>

              {/* What Happened */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  1. What Happened (Technical Context)
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                  {isExpanded ? (
                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {breakdown.whatHappened.split("\n\n").map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {breakdown.whatHappened.length > 400
                        ? breakdown.whatHappened.slice(0, 400).slice(0, breakdown.whatHappened.slice(0, 400).lastIndexOf(" ")) + "..."
                        : breakdown.whatHappened}
                    </p>
                  )}

                  {breakdown.whatHappened.length > 400 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors mt-2"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" /> Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" /> Read Full Article ({Math.round(breakdown.whatHappened.length / 1000)}k chars)
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Companies Involved */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  2. Companies & Key Players Involved
                </h3>
                <div className="flex flex-wrap gap-2">
                  {breakdown.companiesInvolved.map((company) => (
                    <span
                      key={company}
                      className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Technology & Architecture */}
          {activeTab === "technology" && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {breakdown.newTechnology.title}
                  </h3>
                </div>

                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Architecture & Stack Details
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    {breakdown.newTechnology.architecture}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Key Technical Breakthroughs & Primitives
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {breakdown.newTechnology.keyFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Market & DX Impact */}
          {activeTab === "impact" && (
            <div className="space-y-6">
              {/* Market Impact */}
              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-amber-500" /> Market & Economic Impact
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  {breakdown.marketImpact.summary}
                </p>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Disruption Vector:
                  </span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {breakdown.marketImpact.disruptionVector}
                  </p>
                </div>
              </div>

              {/* Developer Impact */}
              <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-3">
                  <Code2 className="w-5 h-5 text-indigo-500" /> Developer DX & Workflow Shift
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  {breakdown.developerImpact.summary}
                </p>
                <div className="mb-4">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
                    Paradigm Shift:
                  </span>
                  <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 px-3 py-1.5 rounded-lg">
                    {breakdown.developerImpact.paradigmShift}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Workflow Changes:
                  </span>
                  <ul className="space-y-1">
                    {breakdown.developerImpact.workflowChanges.map((change, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Startup White-Space Opportunities */}
          {activeTab === "opportunities" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-emerald-500" />
                  White-Space Startup Vectors & SaaS Opportunities
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {breakdown.startupOpportunities.length} Validated Ideas
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {breakdown.startupOpportunities.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {opp.title}
                      </h4>
                      <span className="text-xs font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shrink-0">
                        {opp.potentialValue} Value
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                      {opp.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Target Market:
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                        {opp.targetMarket}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Open Source Repos */}
          {activeTab === "repos" && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-500" />
                Related Open Source Repositories & Frameworks
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {breakdown.openSourceProjects.map((repo, idx) => (
                  <a
                    key={idx}
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-all group block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-1.5">
                        <Code2 className="w-4 h-4" /> {repo.name}
                      </span>
                      {repo.stars && (
                        <span className="text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                          ★ {(repo.stars / 1000).toFixed(1)}k
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                      {repo.description}
                    </p>
                    {repo.language && (
                      <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                        {repo.language}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Jobs & Skills */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              {/* Emerging Roles */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-500" /> Emerging Job Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown.skillsAndJobs.roles.map((role) => (
                    <span
                      key={role}
                      className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-xl shadow-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills to Master */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Technical Competencies to Master
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown.skillsAndJobs.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <a
            href={item.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Verify Live Source on {item.source.name}
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
