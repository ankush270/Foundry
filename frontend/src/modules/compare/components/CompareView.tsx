"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { X, ExternalLink, GitCompareArrows, Sparkles, Trash2 } from "lucide-react";
import { useCompareStore } from "@/store/compare.store";
import { STATUS_TEXT_COLORS } from "@/lib/constants";
import BackLink from "@/components/ui/BackLink";
import PageHeader from "@/components/ui/PageHeader";
import GsapMagnetic from "@/components/animations/GsapMagnetic";
import GsapTiltCard from "@/components/animations/GsapTiltCard";
import { GsapTextReveal, GsapStaggerList } from "@/components/animations/GsapTextReveal";

const fields = [
  { label: "Batch", get: (s: any) => s.batch },
  { label: "Year", get: (s: any) => String(s.year) },
  { label: "Status", get: (s: any) => s.status },
  { label: "Industries", get: (s: any) => s.industries.join(", ") },
  { label: "Location", get: (s: any) => s.location },
  { label: "Country", get: (s: any) => s.country },
  { label: "Team Size", get: (s: any) => s.teamSize || "Not Available" },
  { label: "Funding Stage", get: (s: any) => s.fundingStage || "Not Available" },
  { label: "Founders", get: (s: any) => s.founders.map((f: any) => `${f.name} (${f.title || "Founder"})`).join(", ") },
  { label: "Tags", get: (s: any) => s.tags.slice(0, 5).join(", ") },
];

export default function CompareView() {
  const { selected, remove, clear: clearAll } = useCompareStore();

  if (selected.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="text-center glass-card p-10 rounded-3xl max-w-md mx-auto relative z-10 border border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <GitCompareArrows className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--foreground)] mb-2">No Startups Selected</h1>
          <p className="text-sm text-[var(--muted)] mb-6">Select 2-3 startups from the explorer cards to compare their metrics side-by-side.</p>
          <GsapMagnetic strength={0.3}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Go to Startup Explorer
            </Link>
          </GsapMagnetic>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-gradient-to-b from-indigo-500/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20 relative z-10">
        <BackLink />
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            badgeText="Head-to-Head Comparison"
            title="Startup Matrix Compare"
            subtitle="Deep dive side-by-side comparison across team size, funding stage, batch, and status."
            icon={GitCompareArrows}
          />
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        {/* Header cards */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `180px repeat(${selected.length}, 1fr)` }}>
          <div className="flex items-end p-4">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">Metrics Matrix</span>
          </div>
          {selected.map((s) => (
            <GsapTiltCard key={s.id} maxRotation={6}>
              <div className="glass-card rounded-2xl p-5 text-center relative group border border-white/10 h-full">
                <button
                  onClick={() => remove(s.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/30"
                >
                  <X className="w-4 h-4" />
                </button>
                <img src={s.logo} alt={s.name} loading="lazy" decoding="async" className="w-14 h-14 rounded-2xl mx-auto mb-3 ring-2 ring-white/10 object-contain p-1.5 bg-white/5 shadow-md" />
                <Link href={`/startup/${s.slug}`} className="font-display font-bold text-base text-[var(--foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block">
                  {s.name}
                </Link>
                <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{s.oneLiner}</p>
                {s.website && (
                  <GsapMagnetic strength={0.2}>
                    <a
                      href={s.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-3 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Visit Website
                    </a>
                  </GsapMagnetic>
                )}
              </div>
            </GsapTiltCard>
          ))}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl glass-card overflow-hidden border border-white/10 shadow-xl">
          <GsapStaggerList stagger={0.04}>
            {fields.map((field, fi) => (
              <div
                key={field.label}
                className={`grid items-center border-b border-white/10 last:border-0 ${
                  fi % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                }`}
                style={{ gridTemplateColumns: `180px repeat(${selected.length}, 1fr)` }}
              >
                <div className="px-5 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-wider font-mono">{field.label}</div>
                {selected.map((s) => {
                  const val = field.get(s);
                  return (
                    <div key={s.id} className="px-5 py-4 text-sm font-medium">
                      {field.label === "Status" ? (
                        <span className={`font-bold ${STATUS_TEXT_COLORS[val] || "text-[var(--foreground)]"}`}>{val}</span>
                      ) : val === "Not Available" ? (
                        <span className="text-[var(--muted)]/40 italic text-xs">Not Available</span>
                      ) : (
                        <span className="text-[var(--foreground)]">{val}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </GsapStaggerList>
        </div>
      </div>
    </div>
  );
}
