"use client";

import React, { useState } from "react";
import { OssRepository, PersonalCollection } from "../types";
import { Bookmark, FolderPlus, Trash2, X, ExternalLink, Code2 } from "lucide-react";

interface BookmarkCollectionsProps {
  bookmarkedRepos: OssRepository[];
  onRemoveBookmark: (repoId: string) => void;
  onClose: () => void;
}

export const BookmarkCollections: React.FC<BookmarkCollectionsProps> = ({
  bookmarkedRepos,
  onRemoveBookmark,
  onClose,
}) => {
  const [collectionName, setCollectionName] = useState("");
  const [collections, setCollections] = useState<PersonalCollection[]>([
    {
      id: "col-1",
      name: "Fintech MVP Stack",
      description: "Libraries for market data, quantitative backtesting, and payment processing.",
      repoIds: bookmarkedRepos.map((r) => r.id),
      createdAt: new Date().toLocaleDateString(),
    },
  ]);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim()) return;

    const newCol: PersonalCollection = {
      id: Date.now().toString(),
      name: collectionName,
      description: "Custom project collection",
      repoIds: bookmarkedRepos.map((r) => r.id),
      createdAt: new Date().toLocaleDateString(),
    };

    setCollections((prev) => [...prev, newCol]);
    setCollectionName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <h2 className="font-bold text-lg text-zinc-100">Saved Project Collections</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Create Collection Form */}
          <form onSubmit={handleCreateCollection} className="flex gap-2 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Create new collection name (e.g. 'Fintech Analytics Stack')"
              className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!collectionName.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <FolderPlus className="w-4 h-4" /> Save Collection
            </button>
          </form>

          {/* Bookmarked Repos List */}
          <div>
            <h3 className="text-xs font-mono text-zinc-400 mb-3">Your Bookmarked Repositories ({bookmarkedRepos.length})</h3>
            {bookmarkedRepos.length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-6 text-center bg-zinc-950/50 rounded-xl border border-zinc-800">
                No repositories bookmarked yet. Click the bookmark icon on any repository card to save it here!
              </p>
            ) : (
              <div className="space-y-3">
                {bookmarkedRepos.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition">
                    <div className="flex items-center gap-3">
                      <img src={repo.avatarUrl} alt={repo.owner} className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800" />
                      <div>
                        <h4 className="font-semibold text-sm text-zinc-100">{repo.name}</h4>
                        <p className="text-xs font-mono text-zinc-400">{repo.fullName} • {repo.language}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => onRemoveBookmark(repo.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
