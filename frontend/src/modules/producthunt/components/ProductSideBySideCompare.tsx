"use client";

import React from "react";
import { X, GitCompare, ExternalLink, Sparkles, CheckCircle2, Flame } from "lucide-react";
import { ProductHuntProduct } from "@/modules/producthunt/types";

interface ProductSideBySideCompareProps {
  products: ProductHuntProduct[];
  onRemove: (product: ProductHuntProduct) => void;
  onClose: () => void;
}

export const ProductSideBySideCompare: React.FC<ProductSideBySideCompareProps> = ({
  products,
  onRemove,
  onClose,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 border border-purple-500/30 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-[var(--foreground)]">
                Side-by-Side Product Comparison ({products.length})
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Compare Product Hunt upvotes, tech stack, UVP, and SaaS blueprints
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] space-y-4"
              >
                {/* Product Info Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.logo}
                        alt={prod.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-[var(--foreground)]">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-rose-500 font-mono font-bold">
                          ▲ {prod.votesCount.toLocaleString()} votes
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(prod)}
                      className="text-xs text-rose-500 hover:text-rose-600 p-1"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">
                    {prod.tagline}
                  </p>
                </div>

                {/* Comparison Attributes */}
                <div className="space-y-3 text-xs divide-y divide-slate-200 dark:divide-white/5 pt-2">
                  <div className="pt-2">
                    <span className="font-bold text-[var(--muted)] block uppercase text-[10px] tracking-wider mb-1">
                      Category & Pricing
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                        {prod.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                        {prod.pricingModel}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="font-bold text-[var(--muted)] block uppercase text-[10px] tracking-wider mb-1">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {prod.techStack.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="font-bold text-[var(--muted)] block uppercase text-[10px] tracking-wider mb-1">
                      Unique Value Prop
                    </span>
                    <p className="text-[var(--foreground)] leading-relaxed">
                      {prod.aiExplainer.uniqueValueProp}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="font-bold text-[var(--muted)] block uppercase text-[10px] tracking-wider mb-1">
                      SaaS Clone MVP Build
                    </span>
                    <p className="text-amber-500 font-mono font-bold">
                      ⏱ {prod.cloneBlueprint.estimatedBuildTime} • {prod.cloneBlueprint.monetizationModel}
                    </p>
                  </div>
                </div>

                <a
                  href={prod.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-opacity"
                >
                  Visit Website
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
