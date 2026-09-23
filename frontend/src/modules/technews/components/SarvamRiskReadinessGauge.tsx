"use client";

import { useState } from "react";
import { TechNewsItem } from "@/modules/technews/types";
import { ShieldCheck, Zap, AlertTriangle, CheckSquare, Square, Award } from "lucide-react";

interface SarvamRiskReadinessGaugeProps {
  item: TechNewsItem;
}

export default function SarvamRiskReadinessGauge({ item }: SarvamRiskReadinessGaugeProps) {
  const [completedItems, setCompletedItems] = useState<number[]>([]);

  const actionItems = [
    `Audit API security boundary for ${item.category}`,
    `Review unit economics & runway requirements against ${item.source.name} report`,
    `Benchmark developer workflow shift & latency primitives`,
    `Evaluate white-space startup opportunity: ${item.breakdown.startupOpportunities[0]?.title || "Market Analysis"}`
  ];

  const toggleCheck = (idx: number) => {
    if (completedItems.includes(idx)) {
      setCompletedItems(completedItems.filter((i) => i !== idx));
    } else {
      setCompletedItems([...completedItems, idx]);
    }
  };

  const progressPercent = Math.round((completedItems.length / actionItems.length) * 100);

  return (
    <div className="doodle-card p-6 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] dark:shadow-[4px_4px_0px_0px_#49B6E5] space-y-5">
      <h3 className="doodle-font font-black text-lg text-[#263D5B] dark:text-white flex items-center justify-between border-b-2 border-dashed border-[#263D5B]/20 pb-3">
        <span className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#F97316]" /> Sarvam AI Readiness & Impact Gauges
        </span>
        <span className="doodle-badge text-xs bg-[#49B6E5] text-[#263D5B] px-3 py-1 rounded-full border border-[#263D5B]">
          Audit Matrix
        </span>
      </h3>

      {/* 3 Neobrutalist Gauge Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Gauge 1: Technical Readiness */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-[#263D5B] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Readiness Score
          </div>
          <div className="doodle-font font-black text-2xl text-[#263D5B] dark:text-white">
            88 <span className="text-xs text-slate-500">/100</span>
          </div>
          <span className="doodle-badge text-[9px] bg-[#16A34A] text-white px-2 py-0.2 rounded-full inline-block">
            Production Ready
          </span>
        </div>

        {/* Gauge 2: Disruption Velocity */}
        <div className="p-4 rounded-2xl bg-[#49B6E5]/10 border-2 border-[#263D5B] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#263D5B] dark:text-[#49B6E5]">
            <Zap className="w-4 h-4 text-[#F97316]" /> Disruption Speed
          </div>
          <div className="doodle-font font-black text-lg text-[#263D5B] dark:text-white">
            Ultra-Fast
          </div>
          <span className="doodle-badge text-[9px] bg-[#49B6E5] text-[#263D5B] px-2 py-0.2 rounded-full inline-block">
            Immediate Horizon
          </span>
        </div>

        {/* Gauge 3: Market Risk */}
        <div className="p-4 rounded-2xl bg-[#F97316]/10 border-2 border-[#263D5B] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#F97316]">
            <AlertTriangle className="w-4 h-4" /> Market Risk Level
          </div>
          <div className="doodle-font font-black text-lg text-[#263D5B] dark:text-white">
            Moderate
          </div>
          <span className="doodle-badge text-[9px] bg-[#F97316] text-white px-2 py-0.2 rounded-full inline-block">
            Strategic Shift
          </span>
        </div>
      </div>

      {/* Interactive Developer Checklist */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-[#263D5B]/20 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="doodle-font text-xs font-black uppercase text-[#263D5B] dark:text-white">
            Founder & Architect Action Checklist
          </h4>
          <span className="doodle-font text-xs font-black text-[#49B6E5]">
            {completedItems.length} / {actionItems.length} Done ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-[#263D5B]">
          <div
            className="bg-[#16A34A] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-2 pt-1">
          {actionItems.map((itemText, idx) => {
            const checked = completedItems.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                  checked
                    ? "bg-[#16A34A]/15 border-[#16A34A] text-[#16A34A] font-bold"
                    : "bg-white dark:bg-slate-800 border-[#263D5B]/20 text-slate-700 dark:text-slate-200 font-medium hover:border-[#49B6E5]"
                }`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={`text-xs ${checked ? "line-through" : ""}`}>
                  {itemText}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
