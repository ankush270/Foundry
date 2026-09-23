"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Trash2, ExternalLink, Bookmark } from "lucide-react";
import { startups } from "@/data/startups";
import { useWatchlistStore } from "@/store/watchlist.store";
import BackLink from "@/components/ui/BackLink";

export default function WatchlistView() {
  const { ids, toggle } = useWatchlistStore();
  const watchlisted = startups.filter((s) => ids.includes(s.id));

  return (
    <div className="min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-br from-pink-500/5 via-transparent to-[var(--accent)]/5 -z-10" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <BackLink />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-pink-400" />
            <span className="gradient-text">My Watchlist</span>
          </h1>
          <p className="text-[var(--muted)] mb-8">{watchlisted.length} startup{watchlisted.length !== 1 ? "s" : ""} saved</p>
        </motion.div>

        {watchlisted.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4"><Heart className="w-8 h-8 text-pink-400" /></div>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">No startups saved yet</h2>
            <p className="text-[var(--muted)] mb-4">Explore startups and click the ♥ button to save them here.</p>
            <Link href="/" className="text-[var(--accent)] hover:underline">Browse Startups →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlisted.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/30 hover:shadow-md transition-all group">
                <img src={s.logo} alt={s.name} loading="lazy" decoding="async" className="w-12 h-12 rounded-xl ring-2 ring-[var(--border-color)]" />
                <div className="flex-1 min-w-0">
                  <Link href={`/startup/${s.slug}`} className="font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">{s.name}</Link>
                  <p className="text-xs text-[var(--muted)] truncate">{s.oneLiner}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">{s.batch}</span>
                    {s.industries.slice(0, 2).map((ind) => (<span key={ind} className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--muted)]">{ind}</span>))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={s.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted)] transition-colors"><ExternalLink className="w-4 h-4" /></a>
                  <button onClick={() => toggle(s.id)} className="p-2 rounded-lg hover:bg-red-500/15 text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
