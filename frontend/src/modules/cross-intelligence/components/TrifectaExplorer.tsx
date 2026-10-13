"use client";

import React, { useState, useMemo } from "react";
import {
  Workflow, Building2, Code2, Rocket, ArrowRight, Zap, RefreshCw,
  BookOpen, Layers, CheckCircle2, ChevronRight, Copy, Check, Flame, ExternalLink, Filter
} from "lucide-react";
import { startups } from "@/data/startups";
import {useLiveResearch} from "@/hooks/useLiveResearch";

import { generateTrifectaMatches, getThreeWayNodeContext } from "@/lib/cross-intelligence";
import type { Startup } from "@/data/types";
import type { OssRepository } from "@/modules/githuboss/types";
import type { ProductHuntProduct } from "@/modules/producthunt/types";
import type { TrifectaMatch } from "../types";
import TrifectaBadgeBanner from "./TrifectaBadgeBanner";
import TrifectaFlywheelHub from "./TrifectaFlywheelHub";

export default function TrifectaExplorer() {
  const {repos: SAMPLE_OSS_REPOSITORIES, products: SAMPLE_PRODUCTHUNT_PRODUCTS} = useLiveResearch();
  const [selectedYc, setSelectedYc] = useState<Startup>(startups[0]);
  const [selectedGithub, setSelectedGithub] = useState<OssRepository | undefined>(SAMPLE_OSS_REPOSITORIES[0]);
  const [selectedPh, setSelectedPh] = useState<ProductHuntProduct | undefined>(SAMPLE_PRODUCTHUNT_PRODUCTS[0]);
  
  const [activeTab, setActiveTab] = useState<"flywheel" | "playbook" | "matrix">("flywheel");
  const [copiedPlaybook, setCopiedPlaybook] = useState(false);
  const [hubModalOpen, setHubModalOpen] = useState(false);

  // Dynamic context for current selections
  const nodeContext = useMemo(() => {
    return getThreeWayNodeContext({
      primaryType: "yc",
      ycStartup: selectedYc,
      githubRepo: SAMPLE_OSS_REPOSITORIES.find(r => r.id === selectedGithub?.id),
      productHuntProduct: SAMPLE_PRODUCTHUNT_PRODUCTS.find(p => p.id === selectedPh?.id),
      allYc: startups,
      allGithub: SAMPLE_OSS_REPOSITORIES,
      allPh: SAMPLE_PRODUCTHUNT_PRODUCTS,
    });
  }, [selectedYc, selectedGithub, selectedPh, SAMPLE_OSS_REPOSITORIES, SAMPLE_PRODUCTHUNT_PRODUCTS]);

  const pair = nodeContext.bestTrifectaPair;

  // Curated ecosystem trifectas
  const topTrifectas = useMemo(() => {
    return generateTrifectaMatches(startups, SAMPLE_OSS_REPOSITORIES, SAMPLE_PRODUCTHUNT_PRODUCTS);
  }, [SAMPLE_OSS_REPOSITORIES, SAMPLE_PRODUCTHUNT_PRODUCTS]);

  const handleSelectTrifecta = (tf: TrifectaMatch) => {
    setSelectedYc(tf.ycStartup);
    setSelectedGithub(tf.githubRepo);
    setSelectedPh(tf.productHuntProduct);
  };

  const handleCopyPlaybook = () => {
    if (!pair) return;
    const text = `🚀 3-STEP STARTUP TRIFECTA BLUEPRINT
1. BUSINESS (YC Pitch): ${pair.ycStartup.name} (${pair.ycStartup.batch}) - ${pair.builderPlaybook.ycBusinessModel}
2. CODE (GitHub Stack): ${pair.githubRepo.name} (${pair.githubRepo.stars} ⭐) - ${pair.builderPlaybook.githubArchitecture}
3. GTM (Product Hunt Launch): ${pair.productHuntProduct.name} (${pair.productHuntProduct.votesCount} ▲) - ${pair.builderPlaybook.productHuntLaunchGtm}
Generated via Foundry Trifecta Engine`;
    navigator.clipboard.writeText(text);
    setCopiedPlaybook(true);
    setTimeout(() => setCopiedPlaybook(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] dark:bg-[#111827] text-[var(--foreground)] dark:text-slate-100 font-sans pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-[1680px] mx-auto space-y-8">

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] dark:border-[var(--border-color)] bg-white dark:bg-[#1F2937] p-6 sm:p-10 shadow-sm shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#49B6E5]/20 border border-[#49B6E5] text-[var(--foreground)] dark:text-[var(--accent)] text-xs font-mono font-black uppercase tracking-wider">
                <Workflow className="w-3.5 h-3.5" /> 3-Way Interconnected Ecosystem Hub
              </div>
              
              <h1 className="doodle-font text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)] dark:text-[var(--accent)] leading-none">
                THE TRIFECTA <span className="text-[var(--accent)] dark:text-white">FLYWHEEL</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Connect <strong className="text-amber-600 dark:text-amber-400">YC Startups (Business & Pitch)</strong> ↔ <strong className="text-emerald-600 dark:text-emerald-400">GitHub OSS (Code & Stack)</strong> ↔ <strong className="text-rose-600 dark:text-rose-400">Product Hunt (Go-To-Market Launch)</strong> into a unified 360° learning engine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => setHubModalOpen(true)}
                className="doodle-btn flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-black shadow-sm"
              >
                <Zap className="w-5 h-5" /> Launch Interactive Hub
              </button>

              <button
                onClick={handleCopyPlaybook}
                className="px-5 py-3 rounded-2xl bg-white dark:bg-[#111827] border border-[var(--border-color)] dark:border-[var(--border-color)] text-[var(--foreground)] dark:text-[var(--accent)] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#49B6E5]/10 transition-all shadow-sm"
              >
                {copiedPlaybook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedPlaybook ? "Blueprint Copied!" : "Export Builder Blueprint"}
              </button>
            </div>
          </div>

          {/* 3 Pillars Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t-2 border-[#263D5B]/10 dark:border-white/10">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="doodle-font text-xs font-bold text-amber-900 dark:text-amber-300">
                  1. YC BUSINESS
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Problem, pitch & market validation
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="doodle-font text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  2. GITHUB CODE
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Architecture, open-source stack & repos
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <div className="doodle-font text-xs font-bold text-rose-900 dark:text-rose-300">
                  3. PRODUCT HUNT GTM
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Community launch, upvotes & copy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Trifecta Display */}
        {!pair && <p role="status" className="p-6">No suitable three-way match found. Select a matching combination below.</p>}
        {pair && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="doodle-font text-xl font-black text-[var(--foreground)] dark:text-[var(--accent)] uppercase flex items-center gap-2">
                <Workflow className="w-5 h-5 text-[var(--accent)]" /> Active Ecosystem Trifecta Node
              </h2>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#49B6E5] text-[var(--foreground)]">
                  ⚡ Synergy Score: {pair.synergyScore}%
                </span>
              </div>
            </div>

            {/* 3 Node Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* YC Startup */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1F2937] border-4 border-amber-500/60 shadow-sm shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm">
                    <Building2 className="w-4 h-4" /> YC BUSINESS
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                    {pair.ycStartup.batch}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="doodle-font text-2xl font-black text-[var(--foreground)] dark:text-white">
                    {pair.ycStartup.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    &quot;{pair.ycStartup.oneLiner}&quot;
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-xs space-y-2 border border-amber-500/20">
                  <div className="font-bold text-amber-900 dark:text-amber-300">
                    💡 YC Business Strategy Lesson:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {pair.builderPlaybook.ycBusinessModel}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
                  <span className="text-slate-500">Target Industry:</span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {pair.ycStartup.industries.slice(0, 2).join(", ")}
                  </span>
                </div>
              </div>

              {/* GitHub OSS */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1F2937] border-4 border-emerald-500/60 shadow-sm shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm">
                    <Code2 className="w-4 h-4" /> GITHUB CODE
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {pair.githubRepo.stars.toLocaleString()} ⭐
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="doodle-font text-2xl font-black text-[var(--foreground)] dark:text-white">
                    {pair.githubRepo.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {pair.githubRepo.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs space-y-2 border border-emerald-500/20">
                  <div className="font-bold text-emerald-900 dark:text-emerald-300">
                    ⚙️ Technical Blueprint Lesson:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {pair.builderPlaybook.githubArchitecture}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
                  <span className="text-slate-500">Tech Stack:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {pair.githubRepo.language}
                  </span>
                </div>
              </div>

              {/* Product Hunt */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1F2937] border-4 border-rose-500/60 shadow-sm shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm">
                    <Rocket className="w-4 h-4" /> PRODUCT HUNT GTM
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                    {pair.productHuntProduct.votesCount.toLocaleString()} ▲
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="doodle-font text-2xl font-black text-[var(--foreground)] dark:text-white">
                    {pair.productHuntProduct.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    &quot;{pair.productHuntProduct.tagline}&quot;
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-xs space-y-2 border border-rose-500/20">
                  <div className="font-bold text-rose-900 dark:text-rose-300">
                    🚀 Launch Marketing Lesson:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {pair.builderPlaybook.productHuntLaunchGtm}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
                  <span className="text-slate-500">Launch Date:</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    {pair.productHuntProduct.launchedAtFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curated Trifectas Grid */}
        <div className="space-y-4 pt-4">
          <h2 className="doodle-font text-xl font-black text-[var(--foreground)] dark:text-[var(--accent)] uppercase flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" /> Curated Ecosystem Trifectas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTrifectas.map((tf) => (
              <div
                key={tf.id}
                onClick={() => handleSelectTrifecta(tf)}
                className="group p-5 rounded-3xl bg-white dark:bg-[#1F2937] border-3 border-[#263D5B] dark:border-[var(--border-color)] shadow-sm shadow-sm hover:-translate-y-1 cursor-pointer transition-all duration-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-[#49B6E5] text-[var(--foreground)]">
                    ⚡ {tf.synergyScore}% Synergy
                  </span>
                  <span className="text-xs font-bold text-[var(--accent)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Select <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-amber-800 dark:text-amber-300 truncate">
                      {tf.ycStartup.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Code2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-emerald-800 dark:text-emerald-300 truncate">
                      {tf.githubRepo.name} ({tf.githubRepo.stars.toLocaleString()} ⭐)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Rocket className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="text-rose-800 dark:text-rose-300 truncate">
                      {tf.productHuntProduct.name} ({tf.productHuntProduct.votesCount.toLocaleString()} ▲)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {hubModalOpen && (
        <TrifectaFlywheelHub
          isOpen={hubModalOpen}
          onClose={() => setHubModalOpen(false)}
        />
      )}
    </div>
  );
}
