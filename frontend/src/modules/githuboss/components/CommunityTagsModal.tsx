"use client";

import React, { useState } from "react";
import { OssRepository } from "../types";
import { X, Tag, Plus, Check } from "lucide-react";

interface CommunityTagsModalProps {
  repo: OssRepository | null;
  isOpen: boolean;
  onClose: () => void;
  onAddTag: (repoId: string, tagText: string) => void;
}

export const CommunityTagsModal: React.FC<CommunityTagsModalProps> = ({
  repo,
  isOpen,
  onClose,
  onAddTag,
}) => {
  const [newTag, setNewTag] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !repo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    onAddTag(repo.id, newTag.trim());
    setNewTag("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-zinc-100">Community Use-Case Tags</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Tag **{repo.name}** with what you actually built in production. Community tags train GitRadar's semantic matching model so other developers find the right repo faster.
        </p>

        {/* Existing Tags */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-zinc-400 block">Current Real-World Community Tags:</span>
          <div className="flex flex-wrap gap-2">
            {repo.communityUseCases.map((tag, idx) => (
              <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-zinc-950 text-cyan-300 border border-zinc-800">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Add Tag Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-zinc-800">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="e.g., 'Built high-throughput crypto WebSocket feed scanner'"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            disabled={!newTag.trim()}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            {submitted ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
            <span>{submitted ? "Community Tag Added!" : "Add Community Use-Case Tag"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
