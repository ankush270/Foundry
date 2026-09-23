"use client";

import React from "react";
import { OssRepository } from "../types";
import { X, Star, GitFork, ShieldCheck, Sparkles, Check, ArrowRightLeft, Cpu } from "lucide-react";
import { GithubService } from "@/services/github";

interface SideBySideCompareProps {
  repos: OssRepository[];
  onRemoveRepo: (repoId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const SideBySideCompare: React.FC<SideBySideCompareProps> = ({
  repos,
  onRemoveRepo,
  onClearAll,
  onClose,
}) => {
  if (repos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" data-lenis-prevent>
      <div className="relative w-full max-w-6xl bg-slate-900 dark:bg-[#070A11] text-white border border-slate-700 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" data-lenis-prevent>
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 dark:border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-lg text-white">Side-by-Side Repository Comparison</h2>
            <span className="text-xs font-mono text-slate-400">({repos.length} / 3 selected)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs font-mono text-rose-400 hover:underline"
            >
              Clear Comparison
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="flex-1 overflow-x-auto p-6" data-lenis-prevent>
          <div className={`grid gap-6 min-w-[700px] ${
            repos.length === 1 ? "grid-cols-1" : repos.length === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}>
            {repos.map((repo) => {
              const badgeStyle = GithubService.getScoreBadgeStyle(repo.qualityScore);

              return (
                <div key={repo.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-5">
                  {/* Repo Top Info */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={repo.avatarUrl} alt={repo.owner} className="w-10 h-10 rounded-xl border border-zinc-700 bg-zinc-800" />
                        <div>
                          <h3 className="font-bold text-base text-zinc-100">{repo.name}</h3>
                          <p className="text-xs font-mono text-zinc-400">{repo.fullName}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveRepo(repo.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quality Score Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border}`}>
                        <Sparkles className="w-3.5 h-3.5" /> Quality {repo.qualityScore} / 100
                      </span>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Stars</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400/20" /> {repo.stars.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Commit Velocity</span>
                        <span className="text-zinc-200 font-bold">{repo.monthlyCommitVelocity} / mo</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">License</span>
                        <span className="text-cyan-400 font-semibold">{repo.license}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Language</span>
                        <span className="text-zinc-200">{repo.language}</span>
                      </div>
                    </div>

                    {/* Sarvam AI What it Solves */}
                    <div className="mb-4">
                      <span className="text-[11px] font-mono text-zinc-400 block mb-1">What It Solves</span>
                      <p className="text-xs text-zinc-300 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 leading-relaxed">
                        {repo.sarvamExplainer.whatItSolves}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-4">
                      <span className="text-[11px] font-mono text-zinc-400 block mb-1">Tech Stack</span>
                      <div className="flex flex-wrap gap-1">
                        {repo.sarvamExplainer.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-mono text-emerald-400 block mb-1">Key Pros</span>
                        <ul className="space-y-1">
                          {repo.sarvamExplainer.pros.map((pro, idx) => (
                            <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-rose-400 block mb-1">Key Cons</span>
                        <ul className="space-y-1">
                          {repo.sarvamExplainer.cons.map((con, idx) => (
                            <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold text-xs mt-0.5">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <a
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold text-center border border-cyan-500/30 transition block"
                  >
                    View Repository on GitHub
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
