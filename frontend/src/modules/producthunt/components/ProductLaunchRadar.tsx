"use client";

import React from "react";
import { Flame, TrendingUp, Sparkles, ChevronRight, Award } from "lucide-react";
import { ProductHuntProduct } from "@/modules/producthunt/types";

interface ProductLaunchRadarProps {
  products: ProductHuntProduct[];
  onSelectProduct: (product: ProductHuntProduct) => void;
}

export const ProductLaunchRadar: React.FC<ProductLaunchRadarProps> = ({
  products,
  onSelectProduct,
}) => {
  const topRadarProducts = products
    .filter((p) => p.featured || p.votesCount >= 4000)
    .slice(0, 5);

  if (topRadarProducts.length === 0) return null;

  return (
    <div className="w-full mb-8 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-600/10 border border-rose-500/20 p-4 sm:p-5 backdrop-blur-md relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-base sm:text-lg text-[var(--foreground)] tracking-tight flex items-center gap-2">
              Launch Radar — Today's #1 Trending Products
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Real-time upvotes & AI architecture breakdowns of top Product Hunt launches
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          Live Radar Stream
        </span>
      </div>

      {/* Ticker Row Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {topRadarProducts.map((product, idx) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="group flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-[#0F172A]/90 border border-slate-200 dark:border-white/10 hover:border-rose-500/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono font-extrabold text-xs text-rose-500 w-4 text-center shrink-0">
                #{idx + 1}
              </span>
              <img
                src={product.logo}
                alt={product.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-[var(--foreground)] truncate group-hover:text-rose-500 transition-colors">
                  {product.name}
                </h4>
                <p className="text-[10px] text-[var(--muted)] font-mono">
                  ▲ {product.votesCount.toLocaleString()}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
