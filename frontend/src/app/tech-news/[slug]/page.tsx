"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { TechNewsItem } from "@/modules/technews/types";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Cpu,
  TrendingUp,
  Code2,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  Flame,
  Sparkles,
  Briefcase,
  ShieldCheck,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  Layers,
  Bot,
  Radio,
  RefreshCw,
} from "lucide-react";

import { SarvamTechNewsService } from "@/services/technews/sarvam-technews.service";
import SarvamQaAssistant from "@/modules/technews/components/SarvamQaAssistant";
import SarvamIndicTranslator from "@/modules/technews/components/SarvamIndicTranslator";
import SarvamRiskReadinessGauge from "@/modules/technews/components/SarvamRiskReadinessGauge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TechNewsDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams.slug;

  const [item, setItem] = useState<TechNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingSarvam, setGeneratingSarvam] = useState(false);
  const [isCachedBreakdown, setIsCachedBreakdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "breakdown" | "technology" | "impact" | "opportunities" | "repos" | "skills" | "sarvam"
  >("all");

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      try {
        const res = await fetch(`/api/technews?slug=${encodeURIComponent(rawSlug)}`);
        const data = await res.json();
        let foundItem: TechNewsItem | null = null;
        if (data.success && (data.item || (data.data && data.data.length > 0))) {
          foundItem = data.item || data.data[0];
        } else {
          const fallbackRes = await fetch(`/api/technews?q=${encodeURIComponent(rawSlug.slice(0, 30))}`);
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success && fallbackData.data && fallbackData.data.length > 0) {
            foundItem = fallbackData.data[0];
          }
        }

        if (foundItem) {
          // Check if breakdown was already generated and cached in localStorage
          const cacheKey = `sarvam_foundry_breakdown_${foundItem.id || foundItem.slug}`;
          if (typeof window !== "undefined" && localStorage.getItem(cacheKey)) {
            setIsCachedBreakdown(true);
          }
          
          setItem(foundItem);

          // Trigger Sarvam AI breakdown check (uses localStorage cache if already generated)
          const sarvamBreakdown = await SarvamTechNewsService.generateFoundryBreakdown(foundItem, false);
          if (sarvamBreakdown) {
            setItem((prev) => (prev ? { ...prev, breakdown: sarvamBreakdown } : prev));
          }
        }
      } catch (err) {
        console.error("Failed to load item:", err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [rawSlug]);

  const handleRegenerateSarvamBreakdown = async () => {
    if (!item || generatingSarvam) return;
    setGeneratingSarvam(true);
    try {
      const freshBreakdown = await SarvamTechNewsService.generateFoundryBreakdown(item, true);
      if (freshBreakdown) {
        setItem((prev) => (prev ? { ...prev, breakdown: freshBreakdown } : prev));
        setIsCachedBreakdown(true);
      }
    } catch (e) {
      console.error("Failed to regenerate Sarvam breakdown:", e);
    } finally {
      setGeneratingSarvam(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#49B6E5] animate-spin" />
        <p className="doodle-font text-xs font-black text-slate-500">Loading Sarvam AI Foundry Breakdown Page...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <div className="doodle-card p-10 bg-white dark:bg-[#1E293B]">
          <h1 className="doodle-font font-black text-2xl text-[#263D5B] dark:text-white mb-4">
            Tech News Item Not Found
          </h1>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            We couldn't locate this specific news item. It may have moved or expired from cache.
          </p>
          <Link
            href="/tech-news"
            className="doodle-btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B]"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Tech News Hub
          </Link>
        </div>
      </div>
    );
  }

  const { breakdown } = item;

  const getSourceDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return item.source.name;
    }
  };

  const hasRepos = breakdown.openSourceProjects && breakdown.openSourceProjects.length > 0;

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 sm:px-8 max-w-[1440px] mx-auto font-sans space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/tech-news"
          className="doodle-btn inline-flex items-center gap-2 text-xs font-black px-4 py-2 bg-white dark:bg-[#1E293B] text-[#263D5B] dark:text-white border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] dark:shadow-[3px_3px_0px_0px_#49B6E5]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tech News Hub
        </Link>

        <a
          href={item.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="doodle-badge inline-flex items-center gap-1.5 text-xs font-black bg-[#16A34A] text-white px-3.5 py-2 rounded-xl border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
        >
          <ShieldCheck className="w-4 h-4 text-white" />
          Verify Source: {getSourceDomain(item.source.url)} ↗
        </a>
      </div>

      {/* Main Page Header (Full Width Doodle Neobrutalist Card) */}
      <div className="doodle-card p-6 sm:p-8 bg-white dark:bg-[#1E293B] space-y-5 border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[5px_5px_0px_0px_#263D5B] dark:shadow-[5px_5px_0px_0px_#49B6E5]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="doodle-font font-black text-xs px-3.5 py-1 rounded-full border-2 border-[#263D5B] dark:border-[#49B6E5] bg-[#49B6E5] text-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]">
            {item.category}
          </span>
          <span className="doodle-font font-black text-xs px-3 py-1 rounded-full border-2 border-[#263D5B] dark:border-[#49B6E5] bg-[#F97316] text-white shadow-[2px_2px_0px_0px_#263D5B] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> {item.impactLevel} Impact
          </span>
          <span className="doodle-badge text-xs font-black bg-[#1E293B] text-white dark:bg-[#49B6E5] dark:text-[#263D5B] px-3 py-1 rounded-full border-2 border-[#263D5B] flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-[#F97316]" /> Sarvam AI Enhanced
          </span>
          <button
            onClick={handleRegenerateSarvamBreakdown}
            disabled={generatingSarvam}
            className="doodle-btn text-xs font-black bg-[#FFE569] text-[#263D5B] px-3 py-1 rounded-full border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B] flex items-center gap-1.5 hover:bg-[#ffd836] transition-all disabled:opacity-50"
            title="Clear cache and re-analyze this article with Sarvam AI 105B"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generatingSarvam ? "animate-spin" : ""}`} />
            {generatingSarvam ? "Analyzing with Sarvam AI..." : isCachedBreakdown ? "⚡ Sarvam AI Cached (Re-Analyze)" : "⚡ Sarvam AI Live Breakdown"}
          </button>
          <span className="doodle-font text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" /> {item.readTimeMinutes} min read • Published {item.publishedAt}
          </span>
        </div>

        <h1 className="doodle-font font-black text-2xl sm:text-4xl text-[#263D5B] dark:text-white leading-tight">
          {item.title}
        </h1>

        {/* Premise Box */}
        <div className="p-5 rounded-2xl bg-[#49B6E5]/10 border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B]">
          <h4 className="doodle-font text-xs font-black uppercase text-[#263D5B] dark:text-[#49B6E5] mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F97316]" /> Strategic Premise / Core Thesis
          </h4>
          <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
            {item.premise}
          </p>
        </div>

        {/* Sarvam Indic AI Live Translator Bar */}
        <SarvamIndicTranslator originalPremise={item.premise} />
      </div>


      {/* Interactive Strategic Tab Navigation Bar */}
      <div className="doodle-card p-3 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none p-1">
          {[
            { id: "all", label: "All Sections", icon: Layers },
            { id: "sarvam", label: "Sarvam AI Q&A Chat", icon: Bot },
            { id: "breakdown", label: "1. What Happened", icon: BookOpen },
            { id: "technology", label: "2. Tech & Architecture", icon: Cpu },
            { id: "impact", label: "3. Market & DX Impact", icon: TrendingUp },
            { id: "opportunities", label: "4. Startup Vectors", icon: Lightbulb, badge: breakdown.startupOpportunities.length },
            ...(hasRepos
              ? [{ id: "repos", label: "5. Open Source Repos", icon: Code2, badge: breakdown.openSourceProjects.length }]
              : []),
            { id: "skills", label: "6. Roles & Skills", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`doodle-btn flex items-center gap-2 px-4 py-2.5 text-xs font-black whitespace-nowrap transition-all border-2 border-[#263D5B] dark:border-[#49B6E5] ${
                  active
                    ? "bg-[#49B6E5] text-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="doodle-badge text-[10px] bg-[#F97316] text-white px-2 py-0.2 rounded-full border border-[#263D5B]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sarvam Risk & Readiness Scorecard Gauge */}
      <SarvamRiskReadinessGauge item={item} />

      {/* 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Core Analysis & Technical Breakdown */}
        <div className={activeTab === "all" ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          {/* Dedicated Sarvam AI Q&A Panel */}
          {(activeTab === "all" || activeTab === "sarvam") && (
            <SarvamQaAssistant item={item} />
          )}

          {/* 1. What Happened (Visible on "all" or "breakdown") */}
          {(activeTab === "all" || activeTab === "breakdown") && (
            <div className="doodle-card p-6 sm:p-7 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-4">
              <h3 className="doodle-font font-black text-xl text-[#263D5B] dark:text-white flex items-center gap-2 border-b-2 border-dashed border-[#263D5B]/20 pb-3">
                <BookOpen className="w-6 h-6 text-[#49B6E5]" />
                1. What Happened (Technical Context)
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border-2 border-[#263D5B]/20 space-y-3">
                {isExpanded ? (
                  <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
                    {breakdown.whatHappened.split("\n\n").map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
                    {breakdown.whatHappened.length > 450
                      ? breakdown.whatHappened.slice(0, 450).slice(0, breakdown.whatHappened.slice(0, 450).lastIndexOf(" ")) + "..."
                      : breakdown.whatHappened}
                  </p>
                )}

                {breakdown.whatHappened.length > 450 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="doodle-btn px-4 py-2 bg-[#49B6E5] text-[#263D5B] font-black text-xs border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B] flex items-center gap-1.5 hover:bg-[#3ca0cb] transition-colors mt-2"
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

              {/* Companies Involved */}
              <div className="pt-2">
                <h4 className="doodle-font text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-rose-500" /> Companies & Key Players Involved
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown.companiesInvolved.map((company) => (
                    <span
                      key={company}
                      className="doodle-font text-xs font-black bg-[#49B6E5]/15 text-[#263D5B] dark:text-white px-3.5 py-1.5 rounded-xl border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[2px_2px_0px_0px_#263D5B]"
                    >
                      🏢 {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Technology & Architecture (Visible on "all" or "technology") */}
          {(activeTab === "all" || activeTab === "technology") && (
            <div className="doodle-card p-6 sm:p-7 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-4">
              <h3 className="doodle-font font-black text-xl text-[#263D5B] dark:text-white flex items-center gap-2 border-b-2 border-dashed border-[#263D5B]/20 pb-3">
                <Cpu className="w-6 h-6 text-[#49B6E5]" />
                2. Technology & Architecture Breakdown
              </h3>
              
              <div>
                <h4 className="doodle-font text-sm sm:text-base font-black text-[#263D5B] dark:text-[#49B6E5]">
                  {breakdown.newTechnology.title}
                </h4>
                <p className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-[#263D5B]/20 mt-2 font-bold leading-relaxed">
                  {breakdown.newTechnology.architecture}
                </p>
              </div>

              <div>
                <h4 className="doodle-font text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-2.5">
                  Key Breakthrough Primitives
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {breakdown.newTechnology.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border-2 border-[#263D5B]/20"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Market & Developer DX Impact (Visible on "all" or "impact") */}
          {(activeTab === "all" || activeTab === "impact") && (
            <div className="doodle-card p-6 sm:p-7 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-5">
              <h3 className="doodle-font font-black text-xl text-[#263D5B] dark:text-white flex items-center gap-2 border-b-2 border-dashed border-[#263D5B]/20 pb-3">
                <TrendingUp className="w-6 h-6 text-[#F97316]" />
                3. Market & Developer DX Impact
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Market Impact Box */}
                <div className="p-5 rounded-2xl bg-[#F97316]/10 border-2 border-[#263D5B] space-y-3">
                  <h4 className="doodle-font text-sm font-black text-[#263D5B] dark:text-[#F97316]">
                    Market Disruption Summary
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                    {breakdown.marketImpact.summary}
                  </p>
                  <div className="pt-2 border-t border-[#263D5B]/20">
                    <span className="doodle-font text-[10px] font-black uppercase text-slate-500 block">
                      Disruption Vector:
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                      {breakdown.marketImpact.disruptionVector}
                    </p>
                  </div>
                </div>

                {/* Developer DX Impact Box */}
                <div className="p-5 rounded-2xl bg-[#49B6E5]/10 border-2 border-[#263D5B] space-y-3">
                  <h4 className="doodle-font text-sm font-black text-[#263D5B] dark:text-[#49B6E5]">
                    Developer Paradigm Shift
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                    {breakdown.developerImpact.summary}
                  </p>
                  <div className="pt-2 border-t border-[#263D5B]/20">
                    <span className="doodle-font text-[10px] font-black uppercase text-[#263D5B] dark:text-[#49B6E5] block">
                      Paradigm Shift:
                    </span>
                    <span className="doodle-font text-xs font-black text-[#263D5B] bg-[#49B6E5] px-2.5 py-1 rounded-lg border border-[#263D5B] inline-block mt-1">
                      {breakdown.developerImpact.paradigmShift}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Tab Panel View for Opportunities when explicitly selected */}
          {activeTab === "opportunities" && (
            <div className="doodle-card p-6 sm:p-7 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-4">
              <h3 className="doodle-font font-black text-xl text-[#263D5B] dark:text-white flex items-center justify-between border-b-2 border-dashed border-[#263D5B]/20 pb-3">
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-emerald-500" /> White-Space Startup Vectors & SaaS Opportunities
                </span>
                <span className="doodle-badge text-xs bg-[#16A34A] text-white px-3 py-1 rounded-full border-2 border-[#263D5B]">
                  {breakdown.startupOpportunities.length} Validated Ideas
                </span>
              </h3>

              <div className="space-y-4 pt-2">
                {breakdown.startupOpportunities.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#263D5B]/20 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="doodle-font text-base font-black text-[#263D5B] dark:text-white">
                        {opp.title}
                      </h4>
                      <span className="doodle-badge text-xs bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full border border-[#263D5B]">
                        {opp.potentialValue} Value
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                      {opp.description}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="doodle-font text-xs font-black text-slate-500">Target Market:</span>
                      <span className="doodle-badge text-xs bg-[#49B6E5] text-[#263D5B] px-2.5 py-0.5 rounded-lg border border-[#263D5B]">
                        {opp.targetMarket}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Tab Panel View for Repos when explicitly selected */}
          {activeTab === "repos" && hasRepos && (
            <div className="doodle-card p-6 sm:p-7 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-4">
              <h3 className="doodle-font font-black text-xl text-[#263D5B] dark:text-white flex items-center gap-2 border-b-2 border-dashed border-[#263D5B]/20 pb-3">
                <Code2 className="w-6 h-6 text-purple-600" /> Open Source Repositories & Frameworks
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {breakdown.openSourceProjects.map((repo, idx) => (
                  <a
                    key={idx}
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#263D5B]/20 hover:bg-[#49B6E5]/10 transition-all group block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="doodle-font text-sm font-black text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-1.5">
                        <Code2 className="w-4 h-4" /> {repo.name}
                      </span>
                      {repo.stars && (
                        <span className="doodle-badge text-xs bg-[#F97316] text-white px-2 py-0.5 rounded-full border border-[#263D5B]">
                          ★ {(repo.stars / 1000).toFixed(1)}k
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                      {repo.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Tab Panel View for Skills when explicitly selected */}
          {activeTab === "skills" && (
            <div className="doodle-card p-6 sm:p-7 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-6">
              <h3 className="doodle-font font-black text-xl text-[#263D5B] dark:text-white flex items-center gap-2 border-b-2 border-dashed border-[#263D5B]/20 pb-3">
                <Briefcase className="w-6 h-6 text-[#49B6E5]" /> Emerging Roles & Technical Competencies
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="doodle-font text-xs font-black uppercase text-slate-500 mb-2">Target Job Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.skillsAndJobs.roles.map((role) => (
                      <span key={role} className="doodle-badge text-xs font-black bg-[#49B6E5] text-[#263D5B] px-3.5 py-1.5 rounded-xl border border-[#263D5B]">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#263D5B]/20">
                  <h4 className="doodle-font text-xs font-black uppercase text-slate-500 mb-2">Technical Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.skillsAndJobs.skills.map((skill) => (
                      <span key={skill} className="doodle-badge text-xs font-black bg-slate-100 dark:bg-slate-800 text-[#263D5B] dark:text-slate-200 px-3.5 py-1.5 rounded-xl border border-[#263D5B]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar Widgets (Shown on "all" mode) */}
        {activeTab === "all" && (
          <div className="lg:col-span-4 space-y-6">
            {/* Live Source Verification Card */}
            <div className="doodle-card p-5 bg-[#16A34A]/10 border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#16A34A] shrink-0" />
                <div>
                  <h4 className="doodle-font text-sm font-black text-[#263D5B] dark:text-emerald-400">
                    Live Source Verified
                  </h4>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Published by {item.source.name}
                  </p>
                </div>
              </div>
              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="doodle-btn w-full py-2.5 px-4 bg-[#16A34A] text-white text-xs font-black flex items-center justify-center gap-2 border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
              >
                Open Live Source <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* White-Space Startup Opportunities */}
            <div className="doodle-card p-5 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-4">
              <h4 className="doodle-font font-black text-base text-[#263D5B] dark:text-white flex items-center justify-between border-b-2 border-dashed border-[#263D5B]/20 pb-2.5">
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-500" /> Startup Vectors
                </span>
                <span className="doodle-badge text-[10px] bg-[#16A34A] text-white px-2 py-0.5 rounded-full border border-[#263D5B]">
                  {breakdown.startupOpportunities.length} Ideas
                </span>
              </h4>

              <div className="space-y-3">
                {breakdown.startupOpportunities.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#263D5B]/20 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="doodle-font text-xs font-black text-[#263D5B] dark:text-white leading-snug">
                        {opp.title}
                      </h5>
                      <span className="doodle-badge text-[9px] bg-[#16A34A] text-white px-1.5 py-0.2 rounded-full shrink-0">
                        {opp.potentialValue}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-normal">
                      {opp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Source Repos (Only shown if real GitHub repos exist) */}
            {hasRepos && (
              <div className="doodle-card p-5 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-4">
                <h4 className="doodle-font font-black text-base text-[#263D5B] dark:text-white flex items-center gap-1.5 border-b-2 border-dashed border-[#263D5B]/20 pb-2.5">
                  <Code2 className="w-4 h-4 text-purple-600" /> Open Source Repos
                </h4>

                <div className="space-y-3">
                  {breakdown.openSourceProjects.map((repo, idx) => (
                    <a
                      key={idx}
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#263D5B]/20 hover:bg-[#49B6E5]/10 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="doodle-font text-xs font-black text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5" /> {repo.name}
                        </span>
                        {repo.stars && (
                          <span className="doodle-badge text-[9px] bg-[#F97316] text-white px-1.5 py-0.2 rounded-full border border-[#263D5B]">
                            ★ {(repo.stars / 1000).toFixed(1)}k
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-snug">
                        {repo.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Emerging Roles & Skills */}
            <div className="doodle-card p-5 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] space-y-3">
              <h4 className="doodle-font font-black text-base text-[#263D5B] dark:text-white flex items-center gap-1.5 border-b-2 border-dashed border-[#263D5B]/20 pb-2.5">
                <Briefcase className="w-4 h-4 text-[#49B6E5]" /> Roles & Skills
              </h4>

              <div className="space-y-2">
                <span className="doodle-font text-[10px] font-black uppercase text-slate-500 block">
                  Target Job Roles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {breakdown.skillsAndJobs.roles.map((role) => (
                    <span
                      key={role}
                      className="doodle-font text-[10px] font-black bg-[#49B6E5] text-[#263D5B] px-2.5 py-0.5 rounded-lg border border-[#263D5B]"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="doodle-font text-[10px] font-black uppercase text-slate-500 block">
                  Technical Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {breakdown.skillsAndJobs.skills.map((skill) => (
                    <span
                      key={skill}
                      className="doodle-font text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-[#263D5B] dark:text-slate-200 px-2.5 py-0.5 rounded-lg border border-[#263D5B]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Return Footer */}
      <div className="pt-6 border-t-2 border-dashed border-[#263D5B]/30 flex items-center justify-between">
        <Link
          href="/tech-news"
          className="doodle-font text-xs font-black text-[#263D5B] dark:text-[#49B6E5] flex items-center gap-2 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Tech News Feed
        </Link>
        <a
          href={item.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="doodle-font text-xs font-black text-[#16A34A] flex items-center gap-1.5 hover:underline"
        >
          Verify Source on {item.source.name} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </main>
  );
}
