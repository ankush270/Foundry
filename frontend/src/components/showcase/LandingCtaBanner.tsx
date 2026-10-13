"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Building2, Rocket, Code2 } from "lucide-react";
import GsapMagnetic from "@/components/animations/GsapMagnetic";

export default function LandingCtaBanner() {
  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#263D5B] via-slate-900 to-[#111827] p-6 sm:p-8 text-white border border-[var(--border-color)] dark:border-[var(--border-color)] shadow-sm shadow-sm overflow-hidden">
      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#49B6E5] text-[var(--foreground)] text-xs font-extrabold doodle-font border border-[var(--border-color)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--foreground)]" />
          START RESEARCHING NOW — NO SIGNUP REQUIRED
        </div>

        <h2 className="doodle-font font-black text-2xl sm:text-4xl tracking-tight leading-tight text-white">
          Ready to Forge Your Next Tech Breakthrough?
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Join founders, engineers, and tech analysts using Foundry to discover market gaps, analyze tech stacks, and track ecosystem momentum.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <GsapMagnetic strength={0.3}>
            <Link
              href="/yc"
              className="doodle-btn px-5 py-2.5 text-xs font-extrabold flex items-center gap-2 text-[var(--foreground)] bg-[#49B6E5] border border-[var(--border-color)] shadow-sm hover:scale-105 transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Explore YC Startups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GsapMagnetic>

          <GsapMagnetic strength={0.25}>
            <Link
              href="/producthunt"
              className="doodle-btn px-5 py-2.5 text-xs font-extrabold flex items-center gap-2 text-white bg-[#D97706] border border-[var(--border-color)] shadow-sm hover:scale-105 transition-all"
            >
              <Rocket className="w-3.5 h-3.5" />
              Product Hunt Feed
            </Link>
          </GsapMagnetic>

          <GsapMagnetic strength={0.25}>
            <Link
              href="/githuboss"
              className="doodle-btn px-5 py-2.5 text-xs font-extrabold flex items-center gap-2 text-white bg-[#16A34A] border border-[var(--border-color)] shadow-sm hover:scale-105 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              GitHub GitRadar
            </Link>
          </GsapMagnetic>
        </div>
      </div>
    </div>
  );
}
