"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Building2,
  Rocket,
  Code2,
  Network,
  ArrowRight,
  CheckCircle2,
  Trophy,
  GitCompare,
  TrendingUp,
  Zap,
  Newspaper,
} from "lucide-react";
import InteractiveVideoWalkthrough from "@/components/showcase/InteractiveVideoWalkthrough";
import LandingDataSpotlight from "@/components/showcase/LandingDataSpotlight";
import LandingFaqAccordion from "@/components/showcase/LandingFaqAccordion";
import LandingCtaBanner from "@/components/showcase/LandingCtaBanner";
import HeroLiveSearch from "@/components/search/HeroLiveSearch";
import GsapMagnetic from "@/components/animations/GsapMagnetic";

export default function PlatformShowcaseView() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-4 space-y-8 sm:space-y-10">
      {/* 1. Master Doodle Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 p-6 sm:p-8 text-white border-4 border-[#263D5B] dark:border-[#49B6E5] shadow-[6px_6px_0px_0px_#263D5B] dark:shadow-[6px_6px_0px_0px_#49B6E5] z-30">
        <div className="relative z-10 max-w-4xl space-y-5">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#49B6E5] text-[#263D5B] text-xs font-bold doodle-font border-2 border-[#263D5B]">
            <Sparkles className="w-4 h-4 text-[#263D5B] animate-spin" />
            FOUNDRY — MULTI-ECOSYSTEM TECH INTELLIGENCE
          </div>

          {/* Hero Headline */}
          <h1 className="doodle-font font-black text-3xl sm:text-5xl tracking-tight leading-tight text-white">
            Research, Compare & Build Tech Startups
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-3xl">
            Unified research engine for founders, engineers, and investors. Discover real-time data across{" "}
            <strong className="text-[#49B6E5]">3,400+ YC Startups</strong>,{" "}
            <strong className="text-[#D97706]">Product Hunt Launches</strong>, and{" "}
            <strong className="text-[#16A34A]">100,000+ GitHub Repositories</strong>.
          </p>

          {/* Instant Live Search Component */}
          <HeroLiveSearch />

          {/* Action CTA Buttons & Integrated Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t-2 border-dashed border-[#263D5B]/30">
            <div className="flex flex-wrap gap-2.5">
              <GsapMagnetic strength={0.25}>
                <a
                  href="#video-tour"
                  className="doodle-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5 text-white bg-indigo-600 border-2 border-[#263D5B] shadow-[3px_3px_0px_0px_#263D5B]"
                >
                  <span>Video Tour 🎬</span>
                </a>
              </GsapMagnetic>

              <GsapMagnetic strength={0.2}>
                <Link
                  href="/yc"
                  className="doodle-btn px-4 py-2 rounded-lg bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] font-bold doodle-font text-xs transition-all flex items-center gap-1.5 shadow-[3px_3px_0px_0px_#263D5B]"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  YC Startups
                </Link>
              </GsapMagnetic>

              <GsapMagnetic strength={0.2}>
                <Link
                  href="/producthunt"
                  className="doodle-btn px-4 py-2 rounded-lg bg-[#D97706] text-white border-2 border-[#263D5B] font-bold doodle-font text-xs transition-all flex items-center gap-1.5 shadow-[3px_3px_0px_0px_#263D5B]"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Product Hunt
                </Link>
              </GsapMagnetic>
            </div>

            {/* Embedded Mini Stat Counters */}
            <div className="flex items-center gap-4 text-xs font-bold doodle-font text-slate-300">
              <div>
                <strong className="text-[#49B6E5]">3,400+</strong> YC Startups
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <strong className="text-[#D97706]">100k+</strong> OSS Repos
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <strong className="text-[#16A34A]">$15B+</strong> VC Funding
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Data Spotlight Tabs (Doodle Card Style) */}
      <LandingDataSpotlight />

      {/* 3. 6 Core Ecosystem Services Hubs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] text-xs font-bold doodle-font mb-1 shadow-[2px_2px_0px_0px_#263D5B]">
              ⚡ 6 PLATFORM HUBS
            </div>
            <h2 className="doodle-font font-black text-2xl text-[#263D5B] dark:text-[#49B6E5]">
              Ecosystem Research Hubs
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hub 1: YC Startups */}
          <Link
            href="/yc"
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] flex items-center justify-center font-bold text-base shadow-[2px_2px_0px_0px_#263D5B]">
                  YC
                </div>
                <span className="doodle-badge text-[10px] bg-[#49B6E5] text-[#263D5B]">
                  3,400+ Startups
                </span>
              </div>
              <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white group-hover:text-[#49B6E5] transition-colors">
                Y Combinator Explorer
              </h3>
              <p className="text-xs text-[var(--muted)] leading-normal">
                Batch histories (S05-W26), founder details, hiring jobs, and AI domains.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#49B6E5] border-t-2 border-dashed border-[#263D5B]/20">
              <span>Browse YC Database</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 2: Product Hunt Launches */}
          <Link
            href="/producthunt"
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white border-2 border-[#263D5B] flex items-center justify-center font-bold text-base shadow-[2px_2px_0px_0px_#263D5B]">
                  <Rocket className="w-5 h-5" />
                </div>
                <span className="doodle-badge text-[10px] bg-[#D97706] text-white">
                  Live Launches
                </span>
              </div>
              <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white group-hover:text-[#D97706] transition-colors">
                Product Hunt Feed
              </h3>
              <p className="text-xs text-[var(--muted)] leading-normal">
                Top-voted product launches, upvote velocity, and AI SaaS clone blueprints.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#D97706] border-t-2 border-dashed border-[#263D5B]/20">
              <span>Launch Product Hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 3: GitHub OSS GitRadar */}
          <Link
            href="/githuboss"
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white border-2 border-[#263D5B] flex items-center justify-center font-bold text-base shadow-[2px_2px_0px_0px_#263D5B]">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="doodle-badge text-[10px] bg-[#16A34A] text-white">
                  GitRadar OSS
                </span>
              </div>
              <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white group-hover:text-[#16A34A] transition-colors">
                GitHub OSS Repositories
              </h3>
              <p className="text-xs text-[var(--muted)] leading-normal">
                Match engineering specs to open source code with quality scores.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#16A34A] border-t-2 border-dashed border-[#263D5B]/20">
              <span>Discover Repositories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 4: Startup DNA Graph */}
          <Link
            href="/graph"
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] flex items-center justify-center shadow-[2px_2px_0px_0px_#263D5B]">
                  <Network className="w-5 h-5" />
                </div>
                <span className="doodle-badge text-[10px] bg-[#49B6E5] text-[#263D5B]">
                  2D Matrix
                </span>
              </div>
              <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white group-hover:text-[#49B6E5] transition-colors">
                Startup DNA Graph
              </h3>
              <p className="text-xs text-[var(--muted)] leading-normal">
                Force-directed graph connecting founders, cohorts, and categories.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#49B6E5] border-t-2 border-dashed border-[#263D5B]/20">
              <span>Explore DNA Graph</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 5: Side-by-Side Comparison */}
          <Link
            href="/compare"
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white border-2 border-[#263D5B] flex items-center justify-center shadow-[2px_2px_0px_0px_#263D5B]">
                  <GitCompare className="w-5 h-5" />
                </div>
                <span className="doodle-badge text-[10px] bg-[#D97706] text-white">
                  3-Way Matrix
                </span>
              </div>
              <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white group-hover:text-[#D97706] transition-colors">
                Comparison Engine
              </h3>
              <p className="text-xs text-[var(--muted)] leading-normal">
                Benchmark up to 3 startups or products side-by-side.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#D97706] border-t-2 border-dashed border-[#263D5B]/20">
              <span>Compare Startups</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 6: Tech News Foundry Breakdown */}
          <Link
            href="/tech-news"
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white border-2 border-[#263D5B] flex items-center justify-center shadow-[2px_2px_0px_0px_#263D5B]">
                  <Newspaper className="w-5 h-5" />
                </div>
                <span className="doodle-badge text-[10px] bg-purple-600 text-white">
                  Foundry News
                </span>
              </div>
              <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white group-hover:text-purple-500 transition-colors">
                Tech News — Impact Engine
              </h3>
              <p className="text-xs text-[var(--muted)] leading-normal">
                8-dimensional breakdown: What happened → Impact → White-space startup ideas.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-purple-600 border-t-2 border-dashed border-[#263D5B]/20">
              <span>Explore Tech News</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 6: Ecosystem Games */}
          <Link
            href="/games"
            className="group doodle-card p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-[#1F2937] hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white border-2 border-[#263D5B] flex items-center justify-center shadow-[2px_2px_0px_0px_#263D5B]">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="doodle-badge text-[10px] bg-[#16A34A] text-white">
                  Interactive
                </span>
              </div>
              <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white group-hover:text-[#16A34A] transition-colors">
                Ecosystem Trivia & Games
              </h3>
              <p className="text-xs text-[var(--muted)] leading-normal">
                Test startup knowledge with trivia games and unicorn milestones.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#16A34A] border-t-2 border-dashed border-[#263D5B]/20">
              <span>Play Startup Trivia</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Persona Section (Doodle Cards) */}
      <div className="space-y-4 doodle-card p-5 sm:p-6 bg-[#FAF8F5] dark:bg-[#111827]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] text-xs font-bold doodle-font shadow-[2px_2px_0px_0px_#263D5B]">
          🎯 TARGET PERSONAS
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] space-y-2">
            <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white flex items-center gap-2">
              💡 Founders & Builders
            </h3>
            <ul className="space-y-1.5 text-xs text-[var(--muted)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#49B6E5] shrink-0" />
                <span>Research competitor tech stacks & gaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#49B6E5] shrink-0" />
                <span>Generate full SaaS clone blueprints</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] space-y-2">
            <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white flex items-center gap-2">
              💻 Software Engineers
            </h3>
            <ul className="space-y-1.5 text-xs text-[var(--muted)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>Discover repos with high quality score</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>Compare database models & architecture</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] space-y-2">
            <h3 className="doodle-font font-extrabold text-base text-[#263D5B] dark:text-white flex items-center gap-2">
              📊 Investors & Analysts
            </h3>
            <ul className="space-y-1.5 text-xs text-[var(--muted)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Analyze cohort batch history & team growth</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Identify emerging AI domain trends early</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Compact Interactive Video Walkthrough */}
      <div id="video-tour" className="scroll-mt-24">
        <InteractiveVideoWalkthrough />
      </div>

      {/* 6. Compact FAQ Accordion (Doodle Card Style) */}
      <LandingFaqAccordion />

      {/* 7. Compact Bottom CTA Banner (Doodle Card Style) */}
      <LandingCtaBanner />
    </div>
  );
}
