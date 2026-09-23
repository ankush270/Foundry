import { MapPin } from "lucide-react";
import type { Startup } from "@/data/types";
import StatusBadge from "@/components/ui/StatusBadge";

interface Props {
  startup: Startup;
}

export default function CardFront({ startup }: Props) {
  return (
    <div className="w-full h-full rounded-2xl doodle-card p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 overflow-hidden bg-[var(--surface)]">
      <div className="space-y-2.5">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={startup.logo}
              alt={startup.name}
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 bg-white"
            />
            <div className="min-w-0 flex-1">
              <h3 className="doodle-font font-extrabold text-base text-[var(--foreground)] leading-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {startup.name}
              </h3>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">[{startup.batch}] • {startup.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <StatusBadge status={startup.status} />
            {startup.isHiring && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                Hiring ({startup.jobCount || 1})
              </span>
            )}
          </div>
        </div>

        {/* 1. What They Do */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-0.5 font-mono">
            💡 WHAT THEY DO
          </span>
          <p className="text-xs text-[var(--foreground)] leading-relaxed line-clamp-2 font-normal">
            {startup.oneLiner}
          </p>
        </div>

        {/* 2. Industry & Tags Badges */}
        <div className="flex flex-wrap gap-1">
          {startup.industries.map((ind) => (
            <span
              key={ind}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 truncate max-w-[120px]"
            >
              {ind}
            </span>
          ))}
          {startup.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[100px]"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* 3. 4-Metrics Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[8px] font-mono font-semibold text-slate-500 dark:text-slate-400 block uppercase leading-tight">Year</span>
            <span className="doodle-font font-bold text-xs text-[var(--foreground)]">{startup.year}</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[8px] font-mono font-semibold text-slate-500 dark:text-slate-400 block uppercase leading-tight">Team</span>
            <span className="doodle-font font-bold text-xs text-[var(--foreground)] truncate block">{startup.teamSize || "10+"}</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[8px] font-mono font-semibold text-slate-500 dark:text-slate-400 block uppercase leading-tight">Stage</span>
            <span className="doodle-font font-bold text-[10px] text-[var(--foreground)] truncate block">{startup.fundingStage || "Series"}</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[8px] font-mono font-semibold text-slate-500 dark:text-slate-400 block uppercase leading-tight">Batch</span>
            <span className="doodle-font font-bold text-xs text-indigo-600 dark:text-indigo-400">{startup.batch}</span>
          </div>
        </div>

        {/* 4. Founders List */}
        <div className="pt-0.5">
          <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1 font-mono">
            👥 FOUNDERS
          </span>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {startup.founders.slice(0, 2).map((f, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800 min-w-0">
                {f.avatar ? (
                  <img src={f.avatar} alt={f.name} className="w-4 h-4 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                    {f.name[0]}
                  </div>
                )}
                <span className="text-[10px] font-semibold text-[var(--foreground)] truncate leading-none">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer hint */}
      <div className="pt-2 text-center border-t border-slate-200/60 dark:border-slate-800/80">
        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 inline-block transition-transform">
          Flip for Deep Tech Stack & AI Analysis →
        </span>
      </div>
    </div>
  );
}
