"use client";

import React, { useState, useMemo } from "react";
import {
  X, Sparkles, Building2, Code2, Rocket, ArrowRight, CheckCircle2,
  RefreshCw, Search, ExternalLink, Layers, ShieldCheck, Zap, ChevronRight,
  Star, GitFork, ThumbsUp, MessageSquare, Flame, BookOpen, Share2, Copy, Check
} from "lucide-react";
import type { Startup } from "@/data/types";
import type { OssRepository } from "@/modules/githuboss/types";
import type { ProductHuntProduct } from "@/modules/producthunt/types";
import type { ThreeWayNodeContext, TrifectaMatch } from "../types";
import { startups } from "@/data/startups";
import { SAMPLE_OSS_REPOSITORIES } from "@/data/githuboss-repos";
import { SAMPLE_PRODUCTHUNT_PRODUCTS } from "@/data/producthunt-products";
import { getThreeWayNodeContext, generateTrifectaMatches } from "@/lib/cross-intelligence";
import GsapMagnetic from "@/components/animations/GsapMagnetic";

interface Props {
  initialNodeContext?: ThreeWayNodeContext;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrifectaFlywheelHub({
  initialNodeContext,
  isOpen,
  onClose,
}: Props) {
  const [selectedYc, setSelectedYc] = useState<Startup>(
    initialNodeContext?.ycStartup || startups[0]
  );
  const [selectedGithub, setSelectedGithub] = useState<OssRepository>(
    initialNodeContext?.githubRepo || SAMPLE_OSS_REPOSITORIES[0]
  );
  const [selectedPh, setSelectedPh] = useState<ProductHuntProduct>(
    initialNodeContext?.productHuntProduct || SAMPLE_PRODUCTHUNT_PRODUCTS[0]
  );

  const [activeTab, setActiveTab] = useState<"flywheel" | "playbook" | "matrix">("flywheel");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPlaybook, setCopiedPlaybook] = useState(false);

  // Calculate dynamic 3-way node context for selected items
  const nodeContext = useMemo(() => {
    return getThreeWayNodeContext({
      primaryType: "yc",
      ycStartup: selectedYc,
      githubRepo: selectedGithub,
      productHuntProduct: selectedPh,
      allYc: startups,
      allGithub: SAMPLE_OSS_REPOSITORIES,
      allPh: SAMPLE_PRODUCTHUNT_PRODUCTS,
    });
  }, [selectedYc, selectedGithub, selectedPh]);

  const pair = nodeContext.bestTrifectaPair;

  // Generate top featured ecosystem trifectas
  const topTrifectas = useMemo(() => {
    return generateTrifectaMatches(startups, SAMPLE_OSS_REPOSITORIES, SAMPLE_PRODUCTHUNT_PRODUCTS);
  }, []);

  // Filtered lists for quick selection
  const filteredYc = useMemo(() => {
    if (!searchQuery) return startups.slice(0, 10);
    return startups.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.oneLiner.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10);
  }, [searchQuery]);

  const handleSelectTrifecta = (tf: TrifectaMatch) => {
    setSelectedYc(tf.ycStartup);
    setSelectedGithub(tf.githubRepo);
    setSelectedPh(tf.productHuntProduct);
  };

  const handleCopyPlaybook = () => {
    if (!pair) return;
    const text = `🚀 3-STEP STARTUP TRIFECTA BLUEPRINT
1. BUSINESS (YC Validation): ${pair.ycStartup.name} (${pair.ycStartup.batch}) - ${pair.builderPlaybook.ycBusinessModel}
2. CODE (GitHub Architecture): ${pair.githubRepo.name} (${pair.githubRepo.stars} ⭐) - ${pair.builderPlaybook.githubArchitecture}
3. GTM (Product Hunt Launch): ${pair.productHuntProduct.name} (${pair.productHuntProduct.votesCount} ▲) - ${pair.builderPlaybook.productHuntLaunchGtm}
Generated via Foundry Trifecta Engine`;
    navigator.clipboard.writeText(text);
    setCopiedPlaybook(true);
    setTimeout(() => setCopiedPlaybook(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-white dark:bg-[#111827] border-4 border-[#263D5B] dark:border-[#49B6E5] shadow-[8px_8px_0px_0px_#263D5B] dark:shadow-[8px_8px_0px_0px_#49B6E5] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] dark:bg-[#1F2937] border-b-4 border-[#263D5B] dark:border-[#49B6E5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#49B6E5] border-2 border-[#263D5B] shadow-[3px_3px_0px_0px_#263D5B] flex items-center justify-center text-[#263D5B]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="doodle-font text-xl sm:text-2xl font-black text-[#263D5B] dark:text-[#49B6E5] tracking-tight">
                  TRIFECTA ECOSYSTEM HUB
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-[#49B6E5]/20 text-[#263D5B] dark:text-[#49B6E5] border border-[#49B6E5]/40">
                  YC ↔ GitHub ↔ PH
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                Learn how Business, Code & Go-To-Market interconnect in a symbiotic flywheel.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#111827] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-[#49B6E5] hover:bg-rose-500 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 bg-white dark:bg-[#111827] border-b-2 border-[#263D5B]/20 dark:border-[#49B6E5]/20 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("flywheel")}
              className={`doodle-font flex items-center gap-2 px-4 py-2 text-sm font-bold border-t-2 border-x-2 rounded-t-xl transition-all ${
                activeTab === "flywheel"
                  ? "bg-[#49B6E5] text-[#263D5B] border-[#263D5B] shadow-[2px_-2px_0px_0px_#263D5B]"
                  : "border-transparent text-[#263D5B] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Zap className="w-4 h-4" /> 360° Interactive Flywheel
            </button>
            <button
              onClick={() => setActiveTab("playbook")}
              className={`doodle-font flex items-center gap-2 px-4 py-2 text-sm font-bold border-t-2 border-x-2 rounded-t-xl transition-all ${
                activeTab === "playbook"
                  ? "bg-[#49B6E5] text-[#263D5B] border-[#263D5B] shadow-[2px_-2px_0px_0px_#263D5B]"
                  : "border-transparent text-[#263D5B] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4" /> 3-Step Builder Playbook
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`doodle-font flex items-center gap-2 px-4 py-2 text-sm font-bold border-t-2 border-x-2 rounded-t-xl transition-all ${
                activeTab === "matrix"
                  ? "bg-[#49B6E5] text-[#263D5B] border-[#263D5B] shadow-[2px_-2px_0px_0px_#263D5B]"
                  : "border-transparent text-[#263D5B] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4" /> Top Ecosystem Trifectas
            </button>
          </div>

          {pair && (
            <div className="hidden sm:flex items-center gap-2 pb-2">
              <span className="text-xs font-mono font-bold text-[#49B6E5]">
                Synergy Score: {pair.synergyScore}%
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: 360° FLYWHEEL */}
          {activeTab === "flywheel" && pair && (
            <div className="space-y-6">
              
              {/* Flywheel Node Selector Bar */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="doodle-font text-xs font-bold uppercase text-[#263D5B] dark:text-[#49B6E5]">
                    📌 Customize Active Ecosystem Trifecta:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Select nodes below to test cross-platform synergy
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Select YC */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 block mb-1">
                      1. Select YC Startup (Business):
                    </label>
                    <select
                      value={selectedYc.id}
                      onChange={(e) => {
                        const found = startups.find((s) => s.id === e.target.value);
                        if (found) setSelectedYc(found);
                      }}
                      className="w-full text-xs font-bold p-2 rounded-xl bg-white dark:bg-[#111827] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white"
                    >
                      {startups.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.batch})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select GitHub */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block mb-1">
                      2. Select GitHub OSS (Code):
                    </label>
                    <select
                      value={selectedGithub.id}
                      onChange={(e) => {
                        const found = SAMPLE_OSS_REPOSITORIES.find((r) => r.id === e.target.value);
                        if (found) setSelectedGithub(found);
                      }}
                      className="w-full text-xs font-bold p-2 rounded-xl bg-white dark:bg-[#111827] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white"
                    >
                      {SAMPLE_OSS_REPOSITORIES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.stars.toLocaleString()} ⭐)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Product Hunt */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block mb-1">
                      3. Select Product Hunt (GTM):
                    </label>
                    <select
                      value={selectedPh.id}
                      onChange={(e) => {
                        const found = SAMPLE_PRODUCTHUNT_PRODUCTS.find((p) => p.id === e.target.value);
                        if (found) setSelectedPh(found);
                      }}
                      className="w-full text-xs font-bold p-2 rounded-xl bg-white dark:bg-[#111827] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white"
                    >
                      {SAMPLE_PRODUCTHUNT_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.votesCount.toLocaleString()} ▲)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 3 Pillars Visual Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Pillar 1: YC */}
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-500/40 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#263D5B]">
                      <Building2 className="w-3.5 h-3.5" /> YC BUSINESS
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      {pair.ycStartup.batch}
                    </span>
                  </div>

                  <div>
                    <h3 className="doodle-font text-lg font-black text-[#263D5B] dark:text-white">
                      {pair.ycStartup.name}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 mt-1">
                      "{pair.ycStartup.oneLiner}"
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] pt-2 border-t border-amber-500/20 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="font-bold">Industry:</span>
                      <span>{pair.ycStartup.industries.slice(0, 2).join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Status:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {pair.ycStartup.status}
                      </span>
                    </div>
                  </div>

                  <a
                    href={pair.ycStartup.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline pt-1"
                  >
                    Visit Startup Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Pillar 2: GitHub OSS */}
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500/40 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#263D5B]">
                      <Code2 className="w-3.5 h-3.5" /> GITHUB CODE
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {pair.githubRepo.stars.toLocaleString()} ⭐
                    </span>
                  </div>

                  <div>
                    <h3 className="doodle-font text-lg font-black text-[#263D5B] dark:text-white">
                      {pair.githubRepo.name}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 mt-1">
                      "{pair.githubRepo.description}"
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] pt-2 border-t border-emerald-500/20 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="font-bold">Primary Language:</span>
                      <span>{pair.githubRepo.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">License / Forks:</span>
                      <span>{pair.githubRepo.license} • {pair.githubRepo.forks.toLocaleString()} forks</span>
                    </div>
                  </div>

                  <a
                    href={pair.githubRepo.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline pt-1"
                  >
                    Explore GitHub Repository <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Pillar 3: Product Hunt */}
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500/40 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#263D5B]">
                      <Rocket className="w-3.5 h-3.5" /> PRODUCT HUNT GTM
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                      {pair.productHuntProduct.votesCount.toLocaleString()} ▲
                    </span>
                  </div>

                  <div>
                    <h3 className="doodle-font text-lg font-black text-[#263D5B] dark:text-white">
                      {pair.productHuntProduct.name}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 mt-1">
                      "{pair.productHuntProduct.tagline}"
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] pt-2 border-t border-rose-500/20 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="font-bold">Comments:</span>
                      <span>{pair.productHuntProduct.commentsCount} reviews</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Launch:</span>
                      <span>{pair.productHuntProduct.launchedAtFormatted}</span>
                    </div>
                  </div>

                  <a
                    href={pair.productHuntProduct.productHuntUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline pt-1"
                  >
                    View Product Hunt Launch <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Flywheel Synergy Breakdown Box */}
              <div className="p-5 rounded-2xl bg-[#EBF7FC] dark:bg-[#0F172A] border-2 border-[#49B6E5] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="doodle-font text-sm font-black text-[#263D5B] dark:text-[#49B6E5] uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Why These 3 Reinforce Each Other:
                  </h4>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#49B6E5] text-[#263D5B]">
                    Synergy: {pair.synergyScore}%
                  </span>
                </div>

                <ul className="space-y-2">
                  {pair.synergyReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: 3-STEP BUILDER PLAYBOOK */}
          {activeTab === "playbook" && pair && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="doodle-font text-lg font-black text-[#263D5B] dark:text-[#49B6E5]">
                    3-STEP STARTUP BUILDER PLAYBOOK
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Step-by-step roadmap from YC strategy ➡️ GitHub engineering ➡️ Product Hunt launch.
                  </p>
                </div>

                <button
                  onClick={handleCopyPlaybook}
                  className="doodle-btn flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold"
                >
                  {copiedPlaybook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copiedPlaybook ? "Copied Playbook!" : "Copy Playbook"}
                </button>
              </div>

              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="doodle-font text-sm font-bold text-amber-900 dark:text-amber-300 uppercase">
                    STEP 1: BUSINESS & PITCH VALIDATION (YC METHODOLOGY)
                  </h4>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pl-9 leading-relaxed">
                  {pair.builderPlaybook.ycBusinessModel}
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="doodle-font text-sm font-bold text-emerald-900 dark:text-emerald-300 uppercase">
                    STEP 2: ARCHITECTURE & CODE (GITHUB OPEN SOURCE BLUEPRINT)
                  </h4>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pl-9 leading-relaxed">
                  {pair.builderPlaybook.githubArchitecture}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h4 className="doodle-font text-sm font-bold text-rose-900 dark:text-rose-300 uppercase">
                    STEP 3: GTM & COMMUNITY LAUNCH (PRODUCT HUNT PLAYBOOK)
                  </h4>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pl-9 leading-relaxed">
                  {pair.builderPlaybook.productHuntLaunchGtm}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TOP ECOSYSTEM TRIFECTAS */}
          {activeTab === "matrix" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="doodle-font text-sm font-black text-[#263D5B] dark:text-[#49B6E5] uppercase">
                  🔥 Curated High-Synergy Trifectas
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Click any row to load into Flywheel
                </span>
              </div>

              <div className="space-y-3">
                {topTrifectas.map((tf) => (
                  <div
                    key={tf.id}
                    onClick={() => {
                      handleSelectTrifecta(tf);
                      setActiveTab("flywheel");
                    }}
                    className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F2937] border-2 border-[#263D5B] dark:border-[#49B6E5] hover:bg-[#EBF7FC] dark:hover:bg-[#0F172A] cursor-pointer transition-all flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#49B6E5] text-[#263D5B] font-mono font-black text-xs flex items-center justify-center shrink-0">
                        {tf.synergyScore}%
                      </span>

                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-amber-700 dark:text-amber-400">
                          {tf.ycStartup.name}
                        </span>
                        <span className="text-slate-400">🔗</span>
                        <span className="text-emerald-700 dark:text-emerald-400">
                          {tf.githubRepo.name}
                        </span>
                        <span className="text-slate-400">🔗</span>
                        <span className="text-rose-700 dark:text-rose-400">
                          {tf.productHuntProduct.name}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#49B6E5] flex items-center gap-1">
                      Load Trifecta <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#1F2937] border-t-4 border-[#263D5B] dark:border-[#49B6E5] flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            ✏️ Foundry • 3-Pillar Cross Intelligence Engine
          </span>

          <button
            onClick={onClose}
            className="doodle-btn px-4 py-2 text-xs font-bold"
          >
            Close Trifecta Hub
          </button>
        </div>
      </div>
    </div>
  );
}
