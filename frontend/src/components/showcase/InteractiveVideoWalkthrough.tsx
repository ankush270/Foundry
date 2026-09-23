"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Building2,
  Rocket,
  Code2,
  Bot,
  Network,
  CheckCircle2,
  ArrowRight,
  Flame,
  Star,
  Users,
  Terminal,
  Zap,
} from "lucide-react";

// SSR-Safe Vector Lottie Animation Scene Component
const LottieVectorScene = ({ icon: Icon, color }: { icon: any; color: string }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Outer Lottie Pulsing Rings */}
      <motion.div
        animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full border-4 border-dashed"
        style={{ borderColor: color }}
      />
      <motion.div
        animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full border-2"
        style={{ borderColor: color }}
      />
      {/* Center Animated Icon */}
      <div className="relative z-10 p-6 rounded-2xl bg-[#111827] border-2 border-white/20 shadow-2xl">
        <Icon className="w-12 h-12 animate-pulse" style={{ color }} />
      </div>
    </div>
  );
};

const chapters = [
  {
    id: "yc",
    number: "01",
    title: "Y Combinator Startups Explorer",
    badge: "3,400+ STARTUPS",
    icon: Building2,
    color: "#49B6E5",
    description: "Deep dive into 3,400+ YC startups across batches S05 to W26. Filter by hiring status, AI domain, funding stage, and founder profiles.",
    highlights: [
      "Filter active hiring roles with 1-click",
      "Full batch history & cohort trends",
      "Founder backgrounds & team size analytics",
      "Real-time fuzzy search & industry tags",
    ],
    ctaText: "Explore YC Startups",
    ctaLink: "/yc",
  },
  {
    id: "ph",
    number: "02",
    title: "Product Hunt Live Feed & SaaS Generator",
    badge: "LIVE API FEED",
    icon: Rocket,
    color: "#D97706",
    description: "Track trending product launches live, inspect upvote velocity, read maker stories, and generate full SaaS clone blueprints using AI.",
    highlights: [
      "Live upvote count & launch ranking",
      "Maker background & strategy breakdown",
      "Instant SaaS clone architecture generator",
      "Interactive product launch bookmarking",
    ],
    ctaText: "Launch Product Hunt Hub",
    ctaLink: "/producthunt",
  },
  {
    id: "github",
    number: "03",
    title: "GitHub OSS (GitRadar) Repository Engine",
    badge: "100,000+ REPOS",
    icon: Code2,
    color: "#16A34A",
    description: "Discover production-grade open-source repositories matching your exact engineering requirements with AI quality scoring and maintainer velocity.",
    highlights: [
      "AI Repository Quality & Security Score",
      "Maintainer commit velocity & issue health",
      "Instant terminal install commands",
      "Match open-source tools to SaaS ideas",
    ],
    ctaText: "Explore GitRadar OSS",
    ctaLink: "/githuboss",
  },
  {
    id: "architect",
    number: "04",
    title: "AI Startup Architect & Blueprint Assistant",
    badge: "AI BLUEPRINTS",
    icon: Bot,
    color: "#9333EA",
    description: "Interactive AI chatbot helper that breaks down tech clones (like Airbnb or Stripe) into exact tech stacks, APIs, DB schemas, and step-by-step execution plans.",
    highlights: [
      "Ask real-time Q&A about any architecture",
      "Full API requirements & database models",
      "Estimated development timeline & cost",
      "Monetization & go-to-market strategies",
    ],
    ctaText: "Try AI Architect",
    ctaLink: "/yc",
  },
  {
    id: "graph",
    number: "05",
    title: "Startup DNA Graph & Comparison Engine",
    badge: "RELATIONSHIP MATRIX",
    icon: Network,
    color: "#49B6E5",
    description: "Visualize relationship matrices between startups, founder networks, industry domains, and compare up to 3 products side-by-side.",
    highlights: [
      "Force-directed 2D relationship graph",
      "Side-by-side 3-startup comparison matrix",
      "Cohort overlap & founder connections",
      "Export research notes & watchlists",
    ],
    ctaText: "Open DNA Graph",
    ctaLink: "/graph",
  },
];

export default function InteractiveVideoWalkthrough() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentChapter = chapters[activeChapterIndex];

  // Auto-advance video chapters like a real demo video
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveChapterIndex((idx) => (idx + 1) % chapters.length);
          return 0;
        }
        return prev + 1.25; // 8 seconds per chapter
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activeChapterIndex]);

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    setProgress(0);
  };

  const handleRestart = () => {
    setActiveChapterIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#49B6E5]/15 text-[#263D5B] dark:text-[#49B6E5] border-2 border-[#263D5B] text-xs font-bold doodle-font mb-2">
            <Sparkles className="w-4 h-4 text-[#49B6E5] animate-spin" />
            INTERACTIVE ANIMATED VIDEO DEMO
          </div>
          <h2 className="doodle-font font-black text-2xl sm:text-4xl text-[#263D5B] dark:text-[#49B6E5]">
            How Foundry Works <span className="text-[#49B6E5]">(Video Tour)</span>
          </h2>
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="flex items-center gap-3 bg-[#FAF8F5] dark:bg-[#111827] p-2 rounded-2xl border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] font-bold shadow-[2px_2px_0px_0px_#263D5B] hover:scale-105 transition-transform"
            title={isPlaying ? "Pause Video Demo" : "Play Video Demo"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-white dark:bg-[#1F2937] text-[#263D5B] dark:text-[#49B6E5] border-2 border-[#263D5B] dark:border-[#49B6E5] font-bold hover:scale-105 transition-transform"
            title="Restart Video Tour"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex flex-col min-w-[100px] text-right">
            <span className="text-[10px] font-mono font-bold text-[#49B6E5]">
              CHAPTER {currentChapter.number} / 05
            </span>
            <span className="text-xs font-bold text-[#263D5B] dark:text-slate-200">
              {isPlaying ? "▶ PLAYING DEMO" : "⏸ PAUSED"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Video Frame Component */}
      <div className="relative rounded-3xl bg-[#111827] border-4 border-[#263D5B] dark:border-[#49B6E5] shadow-[8px_8px_0px_0px_#263D5B] dark:shadow-[8px_8px_0px_0px_#49B6E5] overflow-hidden text-white">
        {/* Top Video Player Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#1F2937] border-b-2 border-[#263D5B] text-xs font-mono font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#DC2626] border border-white/20" />
            <span className="w-3 h-3 rounded-full bg-[#D97706] border border-white/20" />
            <span className="w-3 h-3 rounded-full bg-[#16A34A] border border-white/20" />
            <span className="ml-2 text-slate-400">demo_video_player.mp4</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#49B6E5]/20 text-[#49B6E5] border border-[#49B6E5]/40 font-mono">
              60 FPS LOTTIE
            </span>
            <span className="text-[#49B6E5] animate-pulse">● LIVE STREAM</span>
          </div>
        </div>

        {/* Video Scrubber Timeline Bar */}
        <div className="w-full h-2 bg-slate-800 relative">
          <div
            className="h-full bg-[#49B6E5] transition-all duration-100 ease-linear shadow-[0_0_8px_#49B6E5]"
            style={{ width: `${((activeChapterIndex + progress / 100) / chapters.length) * 100}%` }}
          />
        </div>

        {/* Video Screen Content */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
          {/* Left Text & Highlight Content */}
          <div className="lg:col-span-7 space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#49B6E5] text-[#263D5B] font-bold text-xs doodle-font">
                  {currentChapter.badge}
                </div>

                <h3 className="doodle-font font-black text-2xl sm:text-4xl text-white leading-tight">
                  {currentChapter.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  {currentChapter.description}
                </p>

                {/* Feature checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {currentChapter.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 p-2 rounded-xl border border-white/10">
                      <CheckCircle2 className="w-4 h-4 text-[#49B6E5] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <a
                    href={currentChapter.ctaLink}
                    className="doodle-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-bold shadow-[4px_4px_0px_0px_#263D5B]"
                  >
                    <span>{currentChapter.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Vector Animation Box (Lottie Vector Player) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm aspect-square rounded-3xl bg-slate-900 border-2 border-[#49B6E5] p-6 flex flex-col items-center justify-center relative shadow-[6px_6px_0px_0px_#49B6E5] group">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <LottieVectorScene icon={currentChapter.icon} color={currentChapter.color} />
              </div>

              {/* Animated Floating Badges */}
              <div className="w-full mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <span className="text-xs font-bold text-[#49B6E5] doodle-font block">
                  FEATURE PREVIEW #{currentChapter.number}
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  Interactive Vector Scene Output
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Chapter Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-t-2 border-[#263D5B] bg-[#1F2937]">
          {chapters.map((ch, idx) => {
            const Icon = ch.icon;
            const active = idx === activeChapterIndex;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                className={`p-3 sm:p-4 text-left transition-all border-r border-[#263D5B] last:border-r-0 flex flex-col justify-between ${
                  active
                    ? "bg-[#49B6E5] text-[#263D5B] font-bold"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                  <span>{ch.number}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="doodle-font text-xs sm:text-sm font-extrabold truncate">
                  {ch.title.split(" ")[0]} {ch.title.split(" ")[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
