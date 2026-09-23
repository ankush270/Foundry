"use client";

import React, { useState } from "react";
import { Workflow, Building2, Code2, Rocket, ArrowRight, Link2, Zap } from "lucide-react";
import type { Startup } from "@/data/types";
import type { OssRepository } from "@/modules/githuboss/types";
import type { ProductHuntProduct } from "@/modules/producthunt/types";
import { startups } from "@/data/startups";
import { SAMPLE_OSS_REPOSITORIES } from "@/data/githuboss-repos";
import { SAMPLE_PRODUCTHUNT_PRODUCTS } from "@/data/producthunt-products";
import { getThreeWayNodeContext } from "@/lib/cross-intelligence";
import TrifectaFlywheelHub from "./TrifectaFlywheelHub";

interface Props {
  ycStartup?: Startup;
  githubRepo?: OssRepository;
  productHuntProduct?: ProductHuntProduct;
  compact?: boolean;
}

export default function TrifectaBadgeBanner({
  ycStartup,
  githubRepo,
  productHuntProduct,
  compact = false,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const primaryType = ycStartup ? "yc" : githubRepo ? "github" : "producthunt";

  const context = getThreeWayNodeContext({
    primaryType,
    ycStartup,
    githubRepo,
    productHuntProduct,
    allYc: startups,
    allGithub: SAMPLE_OSS_REPOSITORIES,
    allPh: SAMPLE_PRODUCTHUNT_PRODUCTS,
  });

  const pair = context.bestTrifectaPair;
  if (!pair) return null;

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-[#263D5B] dark:border-[#49B6E5] bg-gradient-to-r from-[#FAF8F5] via-white to-[#EBF7FC] dark:from-[#111827] dark:via-[#1F2937] dark:to-[#0F172A] p-4 shadow-[4px_4px_0px_0px_#263D5B] dark:shadow-[4px_4px_0px_0px_#49B6E5] hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 border-b border-[#263D5B]/10 dark:border-[#49B6E5]/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#49B6E5] text-[#263D5B] border border-[#263D5B] shadow-[1px_1px_0px_0px_#263D5B]">
              <Workflow className="w-4 h-4" />
            </span>
            <span className="doodle-font font-black text-sm uppercase tracking-wide text-[#263D5B] dark:text-[#49B6E5]">
              360° Trifecta Ecosystem Synergy
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-[#49B6E5]/20 text-[#263D5B] dark:text-[#49B6E5] border border-[#49B6E5]/40">
              ⚡ {pair.synergyScore}% Synergy Score
            </span>
            <span className="text-xs font-bold text-[#49B6E5] group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Explore Flywheel <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 3-Pillar Node Link Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center pt-1">
          {/* Node 1: YC Business */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white font-black text-xs shrink-0 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                YC Business
              </div>
              <div className="doodle-font text-xs font-bold truncate">
                {pair.ycStartup.name} <span className="opacity-75">({pair.ycStartup.batch})</span>
              </div>
            </div>
          </div>

          {/* Connection Divider */}
          <div className="hidden md:flex justify-center -mx-3">
            <Link2 className="w-4 h-4 text-[#49B6E5] animate-pulse" />
          </div>

          {/* Node 2: GitHub Open Source */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white font-black text-xs shrink-0 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                GitHub Open Source
              </div>
              <div className="doodle-font text-xs font-bold truncate">
                {pair.githubRepo.name} <span className="opacity-75">({pair.githubRepo.stars.toLocaleString()} ⭐)</span>
              </div>
            </div>
          </div>

          {/* Connection Divider */}
          <div className="hidden md:flex justify-center -mx-3">
            <Link2 className="w-4 h-4 text-[#49B6E5] animate-pulse" />
          </div>

          {/* Node 3: Product Hunt Launch */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-300">
            <div className="p-1.5 rounded-lg bg-rose-600 text-white font-black text-xs shrink-0 flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Product Hunt GTM
              </div>
              <div className="doodle-font text-xs font-bold truncate">
                {pair.productHuntProduct.name} <span className="opacity-75">({pair.productHuntProduct.votesCount.toLocaleString()} ▲)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <TrifectaFlywheelHub
          initialNodeContext={context}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
