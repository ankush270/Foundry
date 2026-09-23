"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HelpCircle, CheckCircle, XCircle, Shuffle, Trophy, Zap, Calendar, Sparkles } from "lucide-react";
import { startups } from "@/data/startups";
import { historyEvents } from "@/data/history-events";
import { useQuizStore } from "@/store/quiz.store";
import { generateHints, checkAnswer } from "@/services/quiz.service";
import BackLink from "@/components/ui/BackLink";
import PageHeader from "@/components/ui/PageHeader";

function GuessTheStartup() {
  const { addResult, totalCorrect, totalAttempts, streak, bestStreak } = useQuizStore();
  const [current, setCurrent] = useState(() => startups[Math.floor(Math.random() * startups.length)]);
  const [hints, setHints] = useState<number[]>([0]);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const allHints = useMemo(() => generateHints(current), [current]);

  const revealHint = () => { if (hints.length < allHints.length) setHints([...hints, hints.length]); };

  const submitGuess = () => {
    if (!guess.trim()) return;
    const correct = checkAnswer(guess, current);
    setResult(correct ? "correct" : "wrong");
    setShowAnswer(true);
    addResult(correct);
  };

  const next = () => {
    setCurrent(startups[Math.floor(Math.random() * startups.length)]);
    setHints([0]); setGuess(""); setResult(null); setShowAnswer(false);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--foreground)]"><HelpCircle className="w-5 h-5 text-[var(--accent)]" /> Guess the Startup</h2>
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> {totalCorrect}/{totalAttempts}</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-400" /> Streak: {streak}</span>
          <span>Best: {bestStreak}</span>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-[var(--accent)]/5 to-pink-500/5 border border-[var(--accent)]/20 p-6 mb-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center mb-3"><Sparkles className="w-8 h-8 text-[var(--accent)]" /></div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Mystery Startup</h3>
          <p className="text-xs text-[var(--muted)]">Use hints to guess the YC startup</p>
        </div>

        <div className="space-y-2 mb-4">
          {hints.map((idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-color)]">
              <span className="w-5 h-5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
              <span className="text-sm text-[var(--foreground)]">{allHints[idx]}</span>
            </motion.div>
          ))}
        </div>

        {!showAnswer && hints.length < allHints.length && (
          <button onClick={revealHint} className="w-full py-2 rounded-lg border border-dashed border-[var(--accent)]/30 text-sm text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors mb-4">
            + Reveal Another Hint ({allHints.length - hints.length} remaining)
          </button>
        )}

        {!showAnswer ? (
          <div className="flex gap-2">
            <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitGuess()} placeholder="Type startup name..." className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/50 outline-none focus:border-[var(--accent)]" />
            <button onClick={submitGuess} disabled={!guess.trim()} className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold disabled:opacity-40 hover:bg-[var(--accent-hover)] transition-colors">Guess</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`flex items-center gap-3 p-4 rounded-xl border mb-3 ${result === "correct" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              {result === "correct" ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
              <div>
                <p className={`font-bold ${result === "correct" ? "text-emerald-400" : "text-red-400"}`}>{result === "correct" ? "Correct! 🎉" : "Not quite!"}</p>
                <p className="text-sm text-[var(--muted)]">The answer was: <Link href={`/startup/${current.slug}`} className="text-[var(--accent)] font-semibold hover:underline">{current.name}</Link></p>
              </div>
            </div>
            <button onClick={next} className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2"><Shuffle className="w-4 h-4" /> Next Startup</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function OnThisDay() {
  const randomEvents = useMemo(() => [...historyEvents].sort(() => Math.random() - 0.5).slice(0, 3), []);

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-[var(--foreground)]"><Calendar className="w-5 h-5 text-amber-400" /> YC History Highlights</h2>
      <div className="space-y-4">
        {randomEvents.map((event, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] hover:border-[var(--accent)]/30 transition-colors group">
            <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex flex-col items-center justify-center border border-amber-500/20"><span className="text-lg font-extrabold text-amber-400">{event.year}</span></div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{event.title}</h3>
              <p className="text-xs text-[var(--muted)] mt-1">{event.description}</p>
              {event.startupSlug && <Link href={`/startup/${event.startupSlug}`} className="text-[10px] text-[var(--accent)] hover:underline mt-1 inline-block">View Startup →</Link>}
            </div>
            <span className={`shrink-0 self-start text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
              event.type === "founding" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
              event.type === "acquisition" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
              event.type === "milestone" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
              event.type === "launch" ? "text-purple-400 bg-purple-500/10 border-purple-500/20" :
              "text-[var(--muted)] bg-[var(--surface-hover)] border-[var(--border-color)]"
            }`}>{event.type}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function GamesView() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-br from-amber-500/5 via-transparent to-[var(--accent)]/5 -z-10" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <BackLink />
        <PageHeader title="Startup Games" subtitle="Test your startup knowledge and discover fun facts" />
        <div className="space-y-8">
          <GuessTheStartup />
          <OnThisDay />
        </div>
      </div>
    </div>
  );
}
