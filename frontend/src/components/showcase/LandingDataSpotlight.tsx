"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Rocket,
  Code2,
  ArrowRight,
  TrendingUp,
  Zap,
} from "lucide-react";

interface SampleItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  metricLabel: string;
  metricValue: string;
  batchOrLang: string;
  link: string;
}

const sampleYC: SampleItem[] = [
  {
    id: "stripe",
    name: "Stripe",
    tagline: "Financial infrastructure powering internet commerce.",
    category: "Fintech",
    metricLabel: "Valuation",
    metricValue: "$65B+",
    batchOrLang: "S10 Cohort",
    link: "/startup/stripe",
  },
  {
    id: "supabase",
    name: "Supabase",
    tagline: "Open source Firebase alternative with Postgres & Realtime.",
    category: "Developer Tools",
    metricLabel: "GitHub Stars",
    metricValue: "72.5k★",
    batchOrLang: "S20 Cohort",
    link: "/startup/supabase",
  },
  {
    id: "scaleai",
    name: "Scale AI",
    tagline: "Data infrastructure for AI & model training.",
    category: "Artificial Intelligence",
    metricLabel: "Valuation",
    metricValue: "$13.8B",
    batchOrLang: "S16 Cohort",
    link: "/startup/scale-ai",
  },
];

const samplePH: SampleItem[] = [
  {
    id: "cursor",
    name: "Cursor AI",
    tagline: "AI-first code editor designed for 10x developer speed.",
    category: "AI Developer Tool",
    metricLabel: "PH Upvotes",
    metricValue: "3,840 ▲",
    batchOrLang: "Product #1",
    link: "/producthunt/ph-cursor",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    tagline: "AI conversational answer engine.",
    category: "AI Search",
    metricLabel: "PH Upvotes",
    metricValue: "4,120 ▲",
    batchOrLang: "Product of Month",
    link: "/producthunt/ph-perplexity",
  },
  {
    id: "resend",
    name: "Resend",
    tagline: "Email API & modern template builder for developers.",
    category: "Developer Tools",
    metricLabel: "PH Upvotes",
    metricValue: "2,950 ▲",
    batchOrLang: "Product #1",
    link: "/producthunt/ph-resend",
  },
];

const sampleOSS: SampleItem[] = [
  {
    id: "nextjs",
    name: "vercel/next.js",
    tagline: "The React Framework for the Web.",
    category: "Web Framework",
    metricLabel: "GitHub Stars",
    metricValue: "128,400★",
    batchOrLang: "TypeScript",
    link: "/githuboss?search=next.js",
  },
  {
    id: "ollama",
    name: "ollama/ollama",
    tagline: "Run Llama 3 & open LLMs locally.",
    category: "AI Infrastructure",
    metricLabel: "GitHub Stars",
    metricValue: "105,200★",
    batchOrLang: "Go / C++",
    link: "/githuboss?search=ollama",
  },
  {
    id: "langchain",
    name: "langchain-ai/langchain",
    tagline: "Build applications with LLMs & composable agents.",
    category: "AI Framework",
    metricLabel: "GitHub Stars",
    metricValue: "94,100★",
    batchOrLang: "Python / TS",
    link: "/githuboss?search=langchain",
  },
];

export default function LandingDataSpotlight() {
  const [activeTab, setActiveTab] = useState<"yc" | "ph" | "oss">("yc");

  const currentList =
    activeTab === "yc" ? sampleYC : activeTab === "ph" ? samplePH : sampleOSS;

  return (
    <div className="space-y-4 doodle-card p-5 sm:p-6 bg-[#FAF8F5] dark:bg-[#111827]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B] flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="doodle-font font-black text-xl text-[#263D5B] dark:text-[#49B6E5]">
            Live Ecosystem Spotlight
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] dark:shadow-[3px_3px_0px_0px_#49B6E5]">
          <button
            onClick={() => setActiveTab("yc")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold doodle-font transition-all ${
              activeTab === "yc"
                ? "bg-[#49B6E5] text-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            YC Startups
          </button>
          <button
            onClick={() => setActiveTab("ph")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold doodle-font transition-all ${
              activeTab === "ph"
                ? "bg-[#D97706] text-white shadow-[2px_2px_0px_0px_#263D5B]"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            Product Hunt
          </button>
          <button
            onClick={() => setActiveTab("oss")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold doodle-font transition-all ${
              activeTab === "oss"
                ? "bg-[#16A34A] text-white shadow-[2px_2px_0px_0px_#263D5B]"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            GitHub Repos
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentList.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="doodle-badge text-[10px] bg-[#49B6E5]/20 text-[#263D5B] dark:text-[#49B6E5]">
                  {item.category}
                </span>
                <span className="text-[11px] font-extrabold doodle-font text-[#49B6E5] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {item.batchOrLang}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold doodle-font text-[#263D5B] dark:text-white group-hover:text-[#49B6E5] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">
                  {item.tagline}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-dashed border-[#263D5B]/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-mono text-[var(--muted)]">
                  {item.metricLabel}:
                </span>
                <span className="font-extrabold doodle-font text-[#263D5B] dark:text-white">
                  {item.metricValue}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#49B6E5] group-hover:translate-x-1 transition-transform">
                View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
