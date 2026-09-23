"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Crown, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Medal, 
  ArrowRight,
  ExternalLink,
  Users,
  Lightbulb,
  Building2,
  Filter
} from "lucide-react";
import { getHallOfFame, type HallOfFameEntry, type LeaderboardCategory } from "@/data/hall-of-fame";
import BackLink from "@/components/ui/BackLink";
import PageHeader from "@/components/ui/PageHeader";
import GsapTiltCard from "@/components/animations/GsapTiltCard";
import GsapCounter from "@/components/animations/GsapCounter";

const categoryIcons: Record<string, typeof Trophy> = {
  DollarSign: DollarSign,
  Zap: Zap,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

const TRIVIA_FACTS = [
  "Stripe (S10) reached a $95B+ valuation, making it the most valuable YC company in history.",
  "GitLab (W15) went from YC Demo Day to a public Nasdaq IPO in just 6 years!",
  "OpenAI (W16) started at YC and revolutionized generative AI with ChatGPT and GPT-4o.",
  "Twitch (S07) was originally founded as Justin.tv before pivoting to game streaming and acquiring by Amazon for $970M.",
  "DoorDash (S13) went public in 2020 at a $50B+ market cap, processing over 2 billion deliveries.",
];

export default function HallOfFameView() {
  const leaderboards = useMemo(() => getHallOfFame(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [triviaIndex, setTriviaIndex] = useState<number>(0);

  // Top 3 Overall Champions for the Podium (from Most Valuable category)
  const topChampions = useMemo(() => {
    const mostValuable = leaderboards.find((b) => b.id === "valuable");
    return mostValuable ? mostValuable.entries.slice(0, 3) : [];
  }, [leaderboards]);

  // Filtered leaderboards
  const filteredBoards = useMemo(() => {
    if (selectedCategory === "all") return leaderboards;
    return leaderboards.filter((b) => b.id === selectedCategory);
  }, [leaderboards, selectedCategory]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-indigo-500/10 -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8">
        <BackLink />

        <PageHeader
          badgeText="Prestige Leaderboard"
          title="YC Hall of Fame & Wall of Champions"
          subtitle="Celebrating the most legendary startups in Y Combinator history, ranked by valuation, speed to IPO, mega acquisitions, and AI leadership."
          icon={Crown}
        />

        {/* --- GOLDEN WALL OF CHAMPIONS (TOP 3 PODIUM) --- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold font-display text-[var(--foreground)] tracking-wide uppercase">
              The Wall of Champions
            </h2>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Rank #2 - Silver */}
            {topChampions[1] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="order-2 md:order-1"
              >
                <GsapTiltCard maxRotation={4}>
                  <div className="p-6 rounded-3xl glass-card border border-slate-300/30 bg-gradient-to-b from-slate-400/10 via-transparent to-transparent shadow-xl relative text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg ring-4 ring-slate-900">
                      2
                    </div>
                    <img
                      src={topChampions[1].logo}
                      alt={topChampions[1].name}
                      className="w-16 h-16 rounded-2xl mx-auto mb-3 ring-2 ring-slate-300/40 object-contain p-1.5 bg-white/5"
                    />
                    <h3 className="font-extrabold text-lg text-[var(--foreground)]">{topChampions[1].name}</h3>
                    <p className="text-xs text-[var(--muted)] truncate mt-0.5">{topChampions[1].oneLiner}</p>
                    <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-300/15 border border-slate-300/30 text-slate-200 text-xs font-mono font-bold">
                      {topChampions[1].metric}
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-2 font-medium">
                      Founder: {topChampions[1].founderName}
                    </p>
                    <Link
                      href={`/startup/${topChampions[1].startupSlug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                    >
                      View Legend <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </GsapTiltCard>
              </motion.div>
            )}

            {/* Rank #1 - Gold (Center, Taller) */}
            {topChampions[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="order-1 md:order-2"
              >
                <GsapTiltCard maxRotation={5}>
                  <div className="p-7 rounded-3xl glass-card border border-amber-500/50 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent shadow-2xl shadow-amber-500/10 relative text-center scale-105">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow-xl ring-4 ring-slate-900">
                      👑 1
                    </div>
                    <img
                      src={topChampions[0].logo}
                      alt={topChampions[0].name}
                      className="w-20 h-20 rounded-2xl mx-auto mb-3 ring-4 ring-amber-400/50 object-contain p-2 bg-white/10 shadow-xl"
                    />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 font-mono block mb-1">
                      #1 Most Valuable YC Legend
                    </span>
                    <h3 className="font-extrabold text-2xl text-[var(--foreground)]">{topChampions[0].name}</h3>
                    <p className="text-xs text-[var(--muted)] truncate mt-1">{topChampions[0].oneLiner}</p>
                    <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 text-sm font-mono font-black shadow-lg">
                      {topChampions[0].metric}
                    </div>
                    <p className="text-xs text-amber-200/80 mt-2.5 font-medium">
                      Founders: {topChampions[0].founderName}
                    </p>
                    <Link
                      href={`/startup/${topChampions[0].startupSlug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-colors px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30"
                    >
                      Explore Legend Profile <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </GsapTiltCard>
              </motion.div>
            )}

            {/* Rank #3 - Bronze */}
            {topChampions[2] && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="order-3 md:order-3"
              >
                <GsapTiltCard maxRotation={4}>
                  <div className="p-6 rounded-3xl glass-card border border-amber-700/40 bg-gradient-to-b from-amber-700/15 via-transparent to-transparent shadow-xl relative text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black text-sm flex items-center justify-center shadow-lg ring-4 ring-slate-900">
                      3
                    </div>
                    <img
                      src={topChampions[2].logo}
                      alt={topChampions[2].name}
                      className="w-16 h-16 rounded-2xl mx-auto mb-3 ring-2 ring-amber-700/50 object-contain p-1.5 bg-white/5"
                    />
                    <h3 className="font-extrabold text-lg text-[var(--foreground)]">{topChampions[2].name}</h3>
                    <p className="text-xs text-[var(--muted)] truncate mt-0.5">{topChampions[2].oneLiner}</p>
                    <div className="mt-3 inline-block px-3 py-1 rounded-full bg-amber-700/20 border border-amber-700/40 text-amber-400 text-xs font-mono font-bold">
                      {topChampions[2].metric}
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-2 font-medium">
                      Founder: {topChampions[2].founderName}
                    </p>
                    <Link
                      href={`/startup/${topChampions[2].startupSlug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      View Legend <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </GsapTiltCard>
              </motion.div>
            )}
          </div>
        </div>

        {/* --- YC TRIVIA & DID YOU KNOW TICKER --- */}
        <div className="mb-10 p-5 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-500/20 glass-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  YC Hall of Fame Trivia
                </span>
                <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5">
                  &ldquo;{TRIVIA_FACTS[triviaIndex]}&rdquo;
                </p>
              </div>
            </div>

            <button
              onClick={() => setTriviaIndex((prev) => (prev + 1) % TRIVIA_FACTS.length)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
            >
              Next Trivia 💡
            </button>
          </div>
        </div>

        {/* --- CATEGORY FILTER TABS --- */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                : "glass-card border-white/10 text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            🌟 All Categories ({leaderboards.length})
          </button>

          {leaderboards.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedCategory(b.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedCategory === b.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                  : "glass-card border-white/10 text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {b.category}
            </button>
          ))}
        </div>

        {/* --- LEADERBOARD CATEGORY GRIDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBoards.map((board) => {
            const Icon = categoryIcons[board.iconName] || Trophy;
            return (
              <GsapTiltCard key={board.id} maxRotation={3} className="h-full">
                <div className="rounded-3xl border border-white/10 glass-card overflow-hidden h-full flex flex-col justify-between shadow-2xl">
                  {/* Category Header */}
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-0.5 border border-indigo-500/30 flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg font-display text-[var(--foreground)]">
                          {board.category}
                        </h3>
                        <p className="text-xs text-[var(--muted)]">{board.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard Entries List */}
                  <div className="divide-y divide-white/5">
                    {board.entries.map((entry, ei) => {
                      const isTopThree = ei < 3;
                      const rankColors = [
                        "bg-amber-400 text-slate-950 font-black border-amber-400",
                        "bg-slate-300 text-slate-950 font-black border-slate-300",
                        "bg-amber-700 text-white font-black border-amber-700",
                      ];

                      return (
                        <Link
                          key={entry.startupSlug}
                          href={`/startup/${entry.startupSlug}`}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all group"
                        >
                          {/* Rank Badge */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border shadow-md shrink-0 ${
                              isTopThree
                                ? rankColors[ei]
                                : "bg-white/5 border-white/10 text-[var(--muted)] font-mono font-bold"
                            }`}
                          >
                            {entry.rank}
                          </div>

                          {/* Company Logo */}
                          <img
                            src={entry.logo}
                            alt={entry.name}
                            className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1 ring-1 ring-white/10 shrink-0"
                          />

                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-[var(--foreground)] group-hover:text-indigo-400 transition-colors truncate">
                                {entry.name}
                              </p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--muted)]">
                                {entry.batch}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--muted)] truncate mt-0.5">
                              {entry.oneLiner}
                            </p>
                          </div>

                          {/* Metric Tag */}
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-bold text-indigo-400 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 block">
                              {entry.metric}
                            </span>
                            <span className="text-[10px] text-[var(--muted)] block mt-0.5 truncate max-w-[120px]">
                              {entry.detail}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </GsapTiltCard>
            );
          })}
        </div>

        <p className="text-[11px] text-[var(--muted)] text-center mt-12 font-mono">
          * Valuations and acquisition metrics are estimates synthesized from public financial disclosures and scraped YC directory records.
        </p>
      </div>
    </div>
  );
}

