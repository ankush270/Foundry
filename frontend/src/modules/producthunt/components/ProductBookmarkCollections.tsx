"use client";

import React from "react";
import { X, Bookmark, ExternalLink, Trash2, Flame } from "lucide-react";
import { ProductHuntProduct } from "@/modules/producthunt/types";

interface ProductBookmarkCollectionsProps {
  bookmarks: ProductHuntProduct[];
  onRemoveBookmark: (product: ProductHuntProduct) => void;
  onInspect: (product: ProductHuntProduct) => void;
  onClose: () => void;
}

export const ProductBookmarkCollections: React.FC<ProductBookmarkCollectionsProps> = ({
  bookmarks,
  onRemoveBookmark,
  onInspect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md h-full bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="font-display font-extrabold text-lg text-[var(--foreground)]">
              Saved Research ({bookmarks.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bookmark className="w-12 h-12 text-[var(--muted)] opacity-40 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                No Bookmarked Products Yet
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any Product Hunt card to save products for research and tech analysis.
              </p>
            </div>
          ) : (
            bookmarks.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onInspect(prod)}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] hover:border-rose-500/50 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.logo}
                    alt={prod.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[var(--foreground)] truncate group-hover:text-rose-500 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-[var(--muted)] truncate">
                      {prod.tagline}
                    </p>
                    <span className="text-[10px] font-mono text-rose-500 font-bold">
                      ▲ {prod.votesCount.toLocaleString()} votes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(prod);
                    }}
                    title="Remove from bookmarks"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
