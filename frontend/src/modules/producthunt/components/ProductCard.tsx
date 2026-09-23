"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronUp,
  MessageSquare,
  ExternalLink,
  Flame,
  Bookmark,
  GitCompare,
  Sparkles,
  Layers,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { ProductHuntProduct } from "@/modules/producthunt/types";

interface ProductCardProps {
  product: ProductHuntProduct;
  onInspect: (product: ProductHuntProduct) => void;
  onToggleBookmark: (product: ProductHuntProduct) => void;
  isBookmarked: boolean;
  onToggleCompare: (product: ProductHuntProduct) => void;
  isComparing: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onInspect,
  onToggleBookmark,
  isBookmarked,
  onToggleCompare,
  isComparing,
}) => {
  const [votes, setVotes] = useState(product.votesCount);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVoted) {
      setVotes((v) => v - 1);
      setHasVoted(false);
    } else {
      setVotes((v) => v + 1);
      setHasVoted(true);
    }
  };

  return (
    <div
      onClick={() => onInspect(product)}
      className="group doodle-card relative flex flex-col justify-between p-5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Subtle Gradient Accent */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src={product.logo}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="doodle-font font-bold text-lg text-[var(--foreground)] group-hover:text-rose-500 transition-colors">
                  {product.name}
                </h3>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold doodle-badge bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-[var(--muted)] font-mono">
                Launched {product.launchedAtFormatted} • {product.pricingModel}
              </p>
            </div>
          </div>

          {/* Upvote Button */}
          <button
            onClick={handleVote}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all duration-200 shrink-0 ${
              hasVoted
                ? "bg-rose-600 text-white border-rose-700 shadow-lg shadow-rose-500/30 scale-105 font-mono"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500"
            }`}
          >
            <ChevronUp className={`w-4 h-4 ${hasVoted ? "animate-bounce" : ""}`} />
            <span className="text-xs font-bold font-mono leading-none mt-0.5">
              {votes.toLocaleString()}
            </span>
          </button>
        </div>

        {/* Tagline */}
        <p className="text-sm font-normal text-[var(--foreground)] opacity-90 line-clamp-2 mb-3 leading-relaxed">
          {product.tagline}
        </p>

        {/* Tech Stack & Topics Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono">
            {product.category}
          </span>
          {product.topics.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-white/5 text-[var(--muted)] border border-slate-200 dark:border-white/10 font-mono"
            >
              #{t}
            </span>
          ))}
          {product.ycBatch && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
              YC {product.ycBatch}
            </span>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-[var(--muted)] font-medium font-mono">
          <span className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            {product.commentsCount}
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            AI Blueprint Ready
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            title={isComparing ? "Remove from Compare" : "Compare Product"}
            className={`p-1.5 rounded-lg border transition-colors ${
              isComparing
                ? "bg-purple-500/20 text-purple-500 border-purple-500/40"
                : "text-[var(--muted)] hover:text-purple-500 hover:bg-purple-500/10 border-transparent"
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(product);
            }}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Product"}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? "bg-amber-500/20 text-amber-500 border-amber-500/40"
                : "text-[var(--muted)] hover:text-amber-500 hover:bg-amber-500/10 border-transparent"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
          </button>

          {/* Deep Dive Inspect Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect(product);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/20 font-bold transition-all doodle-font"
          >
            Inspect
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
