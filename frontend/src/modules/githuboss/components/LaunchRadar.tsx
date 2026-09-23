"use client";

import React, { useState } from "react";
import { LaunchRadarItem, DomainCategory } from "../types";
import { GithubService } from "@/services/github";
import { Radio, Sparkles, TrendingUp, Bell, Check, ExternalLink, Zap, Clock, ShieldCheck } from "lucide-react";

interface LaunchRadarProps {
  onSelectDomain: (domain: DomainCategory) => void;
}

export const LaunchRadar: React.FC<LaunchRadarProps> = ({ onSelectDomain }) => {
  const [selectedDomains, setSelectedDomains] = useState<DomainCategory[]>([
    "Fintech",
    "AI & Machine Learning",
    "DevTools & Infrastructure",
  ]);
  const [digestSaved, setDigestSaved] = useState(false);

  const toggleDomain = (d: DomainCategory) => {
    setSelectedDomains((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const handleSavePreferences = () => {
    setDigestSaved(true);
    setTimeout(() => setDigestSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Push Mode Radar Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-900/30 border border-purple-500/30 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-mono mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple-500" />
            <span>Push Mode • Real-time Launch & Early-Mover Intelligence</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight mb-3">
            Don't search for new tools — let high-traction repos find you.
          </h2>

          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            GitRadar actively scans **GitHub Trending**, **Hacker News (Show HN)**, and **Product Hunt** 24/7.
            We filter noise and notify you when a notable new open-source repository gains early traction in your domain.
          </p>

          {/* Domain Alert Subscriptions */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-black/60 border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <h4 className="text-xs font-mono text-[var(--muted)] mb-3 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-purple-500" /> Select Your Domain Interest Subscriptions:
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {(
                [
                  "Fintech",
                  "AI & Machine Learning",
                  "DevTools & Infrastructure",
                  "Healthtech & Bio",
                  "E-Commerce & Retail",
                  "Security & Privacy",
                  "Web3 & Crypto",
                ] as DomainCategory[]
              ).map((domain) => {
                const active = selectedDomains.includes(domain);
                return (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition border ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 font-semibold"
                        : "bg-white dark:bg-white/5 text-[var(--muted)] border-slate-200 dark:border-white/10 hover:border-purple-400"
                    }`}
                  >
                    {active ? "✓ " : "+ "} {domain}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-xs text-[var(--muted)]">
                Receive weekly summary: <strong className="text-[var(--foreground)]">"Top 3 new tools in your domain this week"</strong>
              </span>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 transition"
              >
                {digestSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Bell className="w-3.5 h-3.5" />}
                <span>{digestSaved ? "Alert Preferences Saved!" : "Save Alert Preferences"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Early-Mover Signals Feed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <h3 className="text-lg font-bold text-[var(--foreground)]">Live Launch & Early-Mover Signal Stream</h3>
          </div>
          <span className="text-xs font-mono text-[var(--muted)]">Updated 10 minutes ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {GithubService.getLaunchRadarItems().map((item) => (
            <div key={item.id} className="rounded-2xl glass-card border border-slate-200 dark:border-white/10 hover:border-purple-500/40 p-6 flex flex-col justify-between transition group">
              <div>
                {/* Source & Traction Signal Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[var(--foreground)] border border-slate-200 dark:border-white/10">
                    {item.source}
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-500 animate-bounce" /> {item.tractionSignal}
                  </span>
                </div>

                <h4 className="font-bold text-base text-[var(--foreground)] group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors mb-1">
                  {item.repoName}
                </h4>
                <p className="text-xs font-mono text-[var(--muted)] mb-3">{item.fullName}</p>

                <p className="text-xs text-[var(--foreground)] opacity-85 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Plain One-liner */}
                <div className="p-3 bg-indigo-500/5 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-indigo-600 dark:text-cyan-300 font-mono mb-4">
                  💡 {item.oneLiner}
                </div>
              </div>

              {/* Bottom Metrics */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs font-mono">
                <div className="text-amber-500 font-bold">
                  +{item.starsToday} stars today
                </div>

                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  View Launch <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Digest Preview Section */}
      <div className="rounded-2xl glass-card border border-slate-200 dark:border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-cyan-400">
            <Clock className="w-4 h-4" /> Weekly Curated Digest
          </div>
          <h4 className="text-base font-bold text-[var(--foreground)]">
            "3 Notable Fintech Open Source Tools Launching This Week"
          </h4>
          <p className="text-xs text-[var(--muted)] max-w-xl">
            Get an executive email summary every Monday morning with high-signal repo recommendations so you never spend hours searching manually.
          </p>
        </div>

        <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shrink-0 shadow-md">
          Subscribe to Weekly Digest
        </button>
      </div>
    </div>
  );
};
