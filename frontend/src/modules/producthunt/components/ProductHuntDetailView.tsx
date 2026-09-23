"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Bot,
  CheckCircle2,
  Send,
  Flame,
  Globe,
  Zap,
  BookOpen,
  DollarSign,
  Clock,
  Terminal,
  Bookmark,
  GitCompare,
  ArrowRight,
  TrendingUp,
  Share2,
  Info,
  Building2,
  Check,
  Star,
  Quote,
  ShieldCheck,
  Server,
  Database,
  Radio,
  MessageCircle,
  Video,
} from "lucide-react";
import type { ProductHuntProduct, ProductMaker } from "@/modules/producthunt/types";
import { ProductHuntApiService } from "@/services/producthunt/producthunt-api.service";
import TrifectaBadgeBanner from "@/modules/cross-intelligence/components/TrifectaBadgeBanner";
import TechStackLinker from "@/modules/cross-intelligence/components/TechStackLinker";
import BackLink from "@/components/ui/BackLink";
import GsapCounter from "@/components/animations/GsapCounter";
import GsapMagnetic from "@/components/animations/GsapMagnetic";
import GsapTiltCard from "@/components/animations/GsapTiltCard";
import { GsapTextReveal, GsapScrollGrid } from "@/components/animations/GsapTextReveal";
import { ProductCard } from "./ProductCard";
import MakerPortfolioModal from "./MakerPortfolioModal";
import { SAMPLE_PRODUCTHUNT_PRODUCTS } from "@/data/producthunt-products";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductHuntDetailView({ params }: Props) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductHuntProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Interaction States
  const [votes, setVotes] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<
    "overview" | "architecture" | "blueprint" | "qa" | "oss" | "similar"
  >("overview");
  const [isOssModalOpen, setIsOssModalOpen] = useState(false);
  const [selectedMaker, setSelectedMaker] = useState<ProductMaker | null>(null);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const found = await ProductHuntApiService.getProductByIdOrSlug(id);
      if (isMounted) {
        if (found) {
          setProduct(found);
          setVotes(found.votesCount);
          setChatMessages([
            {
              sender: "ai",
              text: `Hello! I am your Product Hunt AI Architect. Ask me anything about ${found.name}'s technology stack, architecture, pricing model, or MVP clone blueprint.`,
            },
          ]);

          // Check bookmark status
          if (typeof window !== "undefined") {
            try {
              const saved = localStorage.getItem("PH_BOOKMARKS");
              if (saved) {
                const bookmarks: ProductHuntProduct[] = JSON.parse(saved);
                setIsBookmarked(bookmarks.some((b) => b.id === found.id));
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleVote = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hasVoted) {
      setVotes((v) => v - 1);
      setHasVoted(false);
    } else {
      setVotes((v) => v + 1);
      setHasVoted(true);
    }
  };

  const handleToggleBookmark = () => {
    if (!product || typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("PH_BOOKMARKS");
      let list: ProductHuntProduct[] = saved ? JSON.parse(saved) : [];
      if (list.some((b) => b.id === product.id)) {
        list = list.filter((b) => b.id !== product.id);
        setIsBookmarked(false);
      } else {
        list.push(product);
        setIsBookmarked(true);
      }
      localStorage.setItem("PH_BOOKMARKS", JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || !product) return;

    const userText = inputQuery.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = `Based on technical analysis of ${product.name}, here is what you need to know:\n\n`;

      const qLower = userText.toLowerCase();
      if (qLower.includes("tech") || qLower.includes("stack") || qLower.includes("build")) {
        aiReply += `• **Tech Stack:** ${product.techStack.join(", ")}.\n• **Architecture Pattern:** ${product.aiExplainer.techArchitecture.join("\n• ")}`;
      } else if (qLower.includes("money") || qLower.includes("pricing") || qLower.includes("business")) {
        aiReply += `• **Pricing Model:** ${product.pricingModel}.\n• **Monetization Blueprint:** ${product.cloneBlueprint.monetizationModel}.\n• **Target Audience:** ${product.aiExplainer.targetAudience.join(", ")}.`;
      } else if (qLower.includes("clone") || qLower.includes("competitor") || qLower.includes("time")) {
        aiReply += `• **Estimated MVP Build Time:** ${product.cloneBlueprint.estimatedBuildTime}.\n• **Required APIs:** ${product.cloneBlueprint.requiredApis.join(", ")}.\n• **Key Features Checklist:**\n- ${product.cloneBlueprint.keyFeaturesChecklist.join("\n- ")}`;
      } else {
        aiReply += `• **Value Proposition:** ${product.aiExplainer.uniqueValueProp}\n• **Problem Solved:** ${product.aiExplainer.problemSolved}\n• **Pros:** ${product.aiExplainer.pros.join(", ")}`;
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setIsTyping(false);
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16">
        <Flame className="w-10 h-10 text-rose-500 animate-bounce mb-3" />
        <p className="text-sm font-mono text-[var(--muted)] doodle-font">Loading Product Hunt intelligence detail...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16">
        <div className="text-center max-w-md p-8 doodle-card rounded-3xl">
          <Flame className="w-12 h-12 text-rose-500 mx-auto mb-3 opacity-50" />
          <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)] doodle-font">Product Not Found</h1>
          <p className="text-[var(--muted)] text-sm mb-6 font-mono">
            The Product Hunt product you are looking for does not exist or has expired.
          </p>
          <Link
            href="/producthunt"
            className="doodle-btn px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition-all inline-flex items-center gap-2"
          >
            ← Back to Product Hunt Explorer
          </Link>
        </div>
      </div>
    );
  }

  const similarProducts = SAMPLE_PRODUCTHUNT_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.pricingModel === product.pricingModel)
  ).slice(0, 4);

  return (
    <div className="min-h-screen relative overflow-hidden text-[var(--foreground)] bg-[var(--background)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <BackLink href="/producthunt" label="Back to Product Hunt Explorer" />

        <div className="mb-6">
          <TrifectaBadgeBanner productHuntProduct={product} />
        </div>

        {/* 1. Hero Header Banner (Doodle Theme) */}
        <GsapTiltCard maxRotation={2} className="mb-8">
          <div className="doodle-card p-6 sm:p-8 relative overflow-hidden">
            {/* Top Gradient Ribbon */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5 min-w-0 flex-1">
                <img
                  src={product.logo}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-rose-500/20 object-cover p-1.5 bg-white dark:bg-slate-800 shrink-0 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120";
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <h1 className="text-2xl sm:text-4xl font-extrabold doodle-font text-[var(--foreground)] tracking-tight">
                      {product.name}
                    </h1>

                    {/* Scraped Badges (Doodle Badge) */}
                    {product.badge && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full doodle-badge bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        {product.badge}
                      </span>
                    )}

                    <span className="px-3 py-1 rounded-full text-xs font-bold doodle-badge bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                      {product.category}
                    </span>

                    {/* Rating Badge */}
                    {product.rating && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold doodle-badge bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {product.rating.score} ★ ({product.rating.count} PH Reviews)
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-[var(--muted)] font-medium leading-relaxed max-w-3xl mb-3">
                    {product.tagline}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold font-mono text-[var(--muted)]">
                    <span>🚀 Launched {product.launchedAtFormatted}</span>
                    <span>•</span>
                    <span>💳 {product.pricingModel}</span>
                    <span>•</span>
                    <span>💬 {product.commentsCount} Comments</span>
                    {product.ycBatch && (
                      <>
                        <span>•</span>
                        <span className="text-amber-500 font-bold">YC {product.ycBatch}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side Upvote & Primary Action Block */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 shrink-0 border-t lg:border-t-0 border-slate-200 dark:border-white/10 pt-4 lg:pt-0">
                <button
                  onClick={handleVote}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border font-mono font-bold transition-all shadow-lg text-sm sm:text-base ${
                    hasVoted
                      ? "bg-rose-600 text-white border-rose-700 shadow-rose-500/30 scale-105"
                      : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500"
                  }`}
                >
                  <ChevronUp className={`w-6 h-6 ${hasVoted ? "animate-bounce" : ""}`} />
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider opacity-80 leading-none mb-0.5 font-mono">Product Upvotes</span>
                    <span className="font-extrabold text-base leading-none">
                      ▲ <GsapCounter value={votes} />
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  {product.websiteUrl && (
                    <a
                      href={product.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doodle-btn flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all"
                    >
                      <Globe className="w-4 h-4" /> Visit Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={handleCopyLink}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    title="Share product link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </GsapTiltCard>

        {/* 2. Main 2-Column Grid Layout (70% Left Main Content / 30% Right Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT MAIN COLUMN (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Navigation (Doodle Theme) */}
            <div
              className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto scrollbar-none"
              data-lenis-prevent
            >
              {[
                { id: "overview", label: "Overview & Features", icon: BookOpen },
                { id: "architecture", label: "🤖 AI Tech & Security", icon: Cpu },
                { id: "blueprint", label: "🛠️ SaaS Blueprint & Pricing", icon: Layers },
                { id: "qa", label: "💬 AI Product Q&A", icon: Bot },
                { id: "oss", label: "Open Source Tech Stack", icon: Code2 },
                { id: "similar", label: "Similar Products", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`doodle-font flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      active
                        ? "bg-rose-600 text-white shadow-md shadow-rose-500/30"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW & FEATURES */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Screenshot Media Container */}
                {product.mediaGallery && product.mediaGallery.length > 0 && (
                  <div className="relative rounded-3xl overflow-hidden doodle-card bg-black aspect-video max-h-[440px]">
                    <img
                      src={product.mediaGallery[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000";
                      }}
                    />
                  </div>
                )}

                {/* About Product Card (Doodle Card) */}
                <div className="doodle-card p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-extrabold doodle-font text-[var(--foreground)] flex items-center gap-2 uppercase tracking-wide">
                    <BookOpen className="w-5 h-5 text-rose-500" /> About {product.name}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--foreground)] opacity-90 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-[var(--muted)] block mb-2 font-mono uppercase tracking-wider">
                      🏷️ Product Topics & Domain Category
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold doodle-badge">
                        {product.category}
                      </span>
                      {product.topics.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[var(--muted)] text-xs font-mono font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scraped Founder Launch Story / Maker Comment (Doodle Card) */}
                {product.makerComment && (
                  <div className="doodle-card p-6 sm:p-7 relative overflow-hidden bg-rose-500/5 space-y-3">
                    <Quote className="absolute top-4 right-4 w-12 h-12 text-rose-500/15 pointer-events-none" />
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.makerComment.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                        }
                        alt={product.makerComment.author}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/30 shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm doodle-font text-[var(--foreground)]">
                          {product.makerComment.author}
                        </h4>
                        <p className="text-[11px] text-rose-500 font-semibold font-mono">
                          Founder & Maker • Launched {product.makerComment.date}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--foreground)] opacity-90 leading-relaxed italic">
                      "{product.makerComment.text}"
                    </p>
                  </div>
                )}

                {/* Scraped Key Product Features Grid (Doodle Cards) */}
                {product.keyFeatures && product.keyFeatures.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold doodle-font text-[var(--foreground)] flex items-center gap-2">
                      ⚡ Key Features & Product Capabilities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.keyFeatures.map((feat, idx) => (
                        <div
                          key={idx}
                          className="doodle-card p-5 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 font-extrabold text-xs flex items-center justify-center font-mono">
                              0{idx + 1}
                            </span>
                            <h4 className="font-bold text-sm doodle-font text-[var(--foreground)]">
                              {feat.title}
                            </h4>
                          </div>
                          <p className="text-xs text-[var(--muted)] leading-relaxed">
                            {feat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Makers & Founders (Doodle Cards) */}
                {product.makers && product.makers.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-extrabold doodle-font text-[var(--foreground)] flex items-center gap-2">
                      👥 Product Makers & Founding Team
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.makers.map((m, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedMaker(m)}
                          className="doodle-card p-5 flex items-center gap-4 cursor-pointer hover:border-rose-500/50 hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                          <img
                            src={
                              m.avatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                            }
                            alt={m.name}
                            loading="lazy"
                            decoding="async"
                            className="w-14 h-14 rounded-2xl ring-2 ring-rose-500/30 object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <h4 className="font-bold text-base doodle-font text-[var(--foreground)] truncate group-hover:text-rose-500 transition-colors">
                                {m.name}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full doodle-badge bg-rose-500/10 text-rose-500 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                                ✨ View Graph
                              </span>
                            </div>
                            <p className="text-xs text-rose-500 font-semibold truncate font-mono">
                              {m.headline || `@${m.username}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AI TECH & SECURITY EXPLAINER */}
            {activeTab === "architecture" && (
              <div className="space-y-6">
                <div className="doodle-card p-6 bg-indigo-500/10 border-indigo-500/20 text-xs space-y-3">
                  <span className="font-bold text-indigo-500 uppercase tracking-wider text-[11px] font-mono">
                    Core Value Proposition
                  </span>
                  <p className="font-extrabold text-lg doodle-font text-[var(--foreground)]">
                    {product.aiExplainer.uniqueValueProp}
                  </p>
                  <p className="text-[var(--muted)] leading-relaxed text-sm">
                    {product.aiExplainer.problemSolved}
                  </p>
                </div>

                {/* Security Specs (Doodle Card) */}
                {product.techDetails && (
                  <div className="doodle-card p-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] font-mono flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Security, Infrastructure & Compliance Specs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-[var(--muted)] block uppercase font-mono flex items-center gap-1">
                          <Server className="w-3 h-3 text-indigo-500" /> Cloud Hosting
                        </span>
                        <span className="font-bold text-[var(--foreground)] block font-mono">
                          {product.techDetails.hosting || "Vercel / Cloudflare Edge"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-[var(--muted)] block uppercase font-mono flex items-center gap-1">
                          <Database className="w-3 h-3 text-rose-500" /> Persistence Layer
                        </span>
                        <span className="font-bold text-[var(--foreground)] block font-mono">
                          {product.techDetails.database || "PostgreSQL + Redis"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-[var(--muted)] block uppercase font-mono flex items-center gap-1">
                          <Bot className="w-3 h-3 text-purple-500" /> AI Engine Models
                        </span>
                        <span className="font-bold text-[var(--foreground)] block font-mono truncate">
                          {product.techDetails.aiModels?.join(", ") || "Claude 3.5 Sonnet & OpenAI"}
                        </span>
                      </div>
                    </div>

                    {product.techDetails.compliance && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {product.techDetails.compliance.map((c) => (
                          <span
                            key={c}
                            className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold font-mono flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 font-mono">
                    💻 Technologies & Frameworks Stack
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {product.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400"
                      >
                        <Code2 className="w-4 h-4" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 font-mono">
                    ⚡ Technical Architecture Breakdown
                  </h4>
                  <div className="space-y-3">
                    {product.aiExplainer.techArchitecture.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs flex items-start gap-3 text-[var(--foreground)] font-mono"
                      >
                        <Terminal className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="doodle-card p-5 bg-emerald-500/10 border-emerald-500/20 text-xs space-y-3">
                    <h5 className="font-extrabold text-emerald-500 flex items-center gap-2 text-sm doodle-font">
                      <CheckCircle2 className="w-4 h-4" /> Key Advantages (Pros)
                    </h5>
                    <ul className="space-y-2 text-[var(--foreground)]">
                      {product.aiExplainer.pros.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="doodle-card p-5 bg-rose-500/10 border-rose-500/20 text-xs space-y-3">
                    <h5 className="font-extrabold text-rose-500 flex items-center gap-2 text-sm doodle-font">
                      <Zap className="w-4 h-4" /> Trade-offs & Challenges (Cons)
                    </h5>
                    <ul className="space-y-2 text-[var(--foreground)]">
                      {product.aiExplainer.cons.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SAAS BLUEPRINT & PRICING */}
            {activeTab === "blueprint" && (
              <div className="space-y-6">
                <div className="doodle-card p-6 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border-rose-500/20 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-lg doodle-font text-[var(--foreground)] mb-1">
                      {product.cloneBlueprint.saasCloneTitle}
                    </h4>
                    <p className="text-xs text-[var(--muted)]">
                      Actionable technical roadmap to build a SaaS competitor or clone.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-mono font-bold text-xs">
                    <span className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20">
                      <Clock className="w-4 h-4" />
                      {product.cloneBlueprint.estimatedBuildTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
                      <DollarSign className="w-4 h-4" />
                      {product.cloneBlueprint.monetizationModel}
                    </span>
                  </div>
                </div>

                {/* Scraped Pricing Tiers Cards (Doodle Cards) */}
                {product.pricingTiers && product.pricingTiers.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] font-mono flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-500" /> Pricing Plans & Monetization Tiers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {product.pricingTiers.map((tier, idx) => (
                        <div
                          key={idx}
                          className={`doodle-card p-5 flex flex-col justify-between relative transition-all ${
                            tier.popular
                              ? "bg-gradient-to-b from-rose-500/10 via-white/80 dark:via-[#0F172A]/90 to-rose-500/5 border-rose-500/50 shadow-xl scale-[1.02]"
                              : ""
                          }`}
                        >
                          {tier.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white shadow-md font-mono">
                              Most Popular
                            </span>
                          )}
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-extrabold text-base doodle-font text-[var(--foreground)]">
                                {tier.name}
                              </h5>
                              <span className="text-xl font-black font-mono text-rose-500 block mt-1">
                                {tier.price}
                              </span>
                              <p className="text-xs text-[var(--muted)] mt-1">
                                {tier.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs">
                              {tier.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-[var(--foreground)] opacity-90">
                                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveTab("qa")}
                            className={`w-full mt-5 py-2 rounded-xl text-xs font-bold transition-all doodle-font ${
                              tier.popular
                                ? "doodle-btn bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20"
                                : "bg-slate-100 dark:bg-white/5 hover:bg-rose-500 hover:text-white text-[var(--foreground)] border border-slate-200 dark:border-white/10"
                            }`}
                          >
                            Build This Plan →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 font-mono">
                    🔌 Required Third-Party APIs
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {product.cloneBlueprint.requiredApis.map((api) => (
                      <span
                        key={api}
                        className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold"
                      >
                        ⚡ {api}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 font-mono">
                    🏗️ Build Implementation Steps
                  </h4>
                  <div className="space-y-3">
                    {product.cloneBlueprint.architectureSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs text-[var(--foreground)] font-mono"
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 font-mono">
                    🗄️ Database Schema Outline (PostgreSQL)
                  </h4>
                  <div className="p-5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-white/10 space-y-2 overflow-x-auto shadow-xl">
                    {product.cloneBlueprint.databaseSchemaOutline.map((tbl, i) => (
                      <div key={i}>{tbl}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AI PRODUCT Q&A CHATBOT */}
            {activeTab === "qa" && (
              <div className="flex flex-col h-[560px] doodle-card p-5 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 mb-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender === "ai" && (
                        <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                          <Bot className="w-4.5 h-4.5 text-rose-500" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-rose-600 text-white font-medium rounded-br-none shadow-sm"
                            : "bg-white dark:bg-slate-800 text-[var(--foreground)] border border-slate-200 dark:border-white/10 rounded-bl-none shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-mono animate-pulse">
                      <Bot className="w-4 h-4 text-rose-500" />
                      AI Assistant is thinking...
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendQuery} className="flex gap-2">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={`Ask a question about building ${product.name}...`}
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-rose-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="doodle-btn px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-md shadow-rose-500/20"
                  >
                    <Send className="w-4 h-4" /> Ask AI
                  </button>
                </form>
              </div>
            )}

            {/* TAB 5: BUILD WITH OSS */}
            {activeTab === "oss" && (
              <div className="space-y-6">
                <div className="doodle-card p-6 sm:p-8">
                  <h3 className="text-lg font-bold doodle-font text-[var(--foreground)] mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-500" /> Build {product.name} with Open Source
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                    Discover GitHub repositories that can help you build a product like{" "}
                    <strong className="text-[var(--foreground)]">{product.name}</strong> — find tech stack
                    components, open-source alternatives, and repos solving the same problem.
                  </p>
                  <GsapMagnetic strength={0.25}>
                    <button
                      onClick={() => setIsOssModalOpen(true)}
                      className="doodle-btn flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
                    >
                      <Code2 className="w-4 h-4" />
                      Open OSS Tech Stack Explorer
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </GsapMagnetic>
                </div>
              </div>
            )}

            {/* TAB 6: SIMILAR PRODUCTS */}
            {activeTab === "similar" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold doodle-font text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" /> Similar Products on Product Hunt
                </h3>
                <GsapScrollGrid className="grid grid-cols-1 sm:grid-cols-2 gap-5" stagger={0.08}>
                  {similarProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onInspect={(prod) => {
                        window.location.href = `/producthunt/${prod.slug || prod.id}`;
                      }}
                      onToggleBookmark={() => {}}
                      isBookmarked={false}
                      onToggleCompare={() => {}}
                      isComparing={false}
                    />
                  ))}
                </GsapScrollGrid>
              </div>
            )}
          </div>

          {/* RIGHT STICKY SIDEBAR COLUMN (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Widget 1: Key Product Specs Card (Doodle Card) */}
            <div className="doodle-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-extrabold text-sm doodle-font text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-500" /> Product Intelligence
                </h3>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full doodle-badge bg-rose-500/10 text-rose-500">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] font-bold text-[var(--muted)] block font-mono uppercase">Upvotes</span>
                  <span className="font-extrabold text-base text-rose-500 font-mono">
                    ▲ {votes.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] font-bold text-[var(--muted)] block font-mono uppercase">Comments</span>
                  <span className="font-extrabold text-base text-[var(--foreground)] font-mono">
                    💬 {product.commentsCount}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] font-bold text-[var(--muted)] block font-mono uppercase">Pricing</span>
                  <span className="font-bold text-xs text-emerald-500 block truncate font-mono">
                    {product.pricingModel}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] font-bold text-[var(--muted)] block font-mono uppercase">Launch Date</span>
                  <span className="font-bold text-xs text-[var(--foreground)] block truncate font-mono">
                    {product.launchedAtFormatted}
                  </span>
                </div>
              </div>

              {/* Action Buttons inside Sidebar */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setActiveTab("qa")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold doodle-btn bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white shadow-md shadow-rose-500/20 hover:opacity-95 transition-all"
                >
                  <Bot className="w-4 h-4 text-rose-200" /> Ask AI How to Build
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleBookmark}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all doodle-font ${
                      isBookmarked
                        ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                        : "border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-amber-500"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500" : ""}`} />
                    {isBookmarked ? "Saved" : "Save"}
                  </button>

                  <button
                    onClick={() => setIsComparing(!isComparing)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all doodle-font ${
                      isComparing
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                        : "border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-purple-400"
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    {isComparing ? "Comparing" : "Compare"}
                  </button>
                </div>
              </div>
            </div>

            {/* Widget 2: Tech Stack Quick Card (Doodle Card) */}
            <div className="doodle-card p-6 space-y-3">
              <h3 className="font-extrabold text-sm doodle-font text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" /> Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Widget 3: Official Links (Doodle Card) */}
            <div className="doodle-card p-6 space-y-3">
              <h3 className="font-extrabold text-sm doodle-font text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-500" /> Official Resources & Links
              </h3>
              <div className="space-y-2 text-xs font-bold doodle-font">
                {product.websiteUrl && (
                  <a
                    href={product.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-[var(--foreground)] hover:text-rose-500 hover:border-rose-500/40 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-rose-500" /> Official Website
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)]" />
                  </a>
                )}
                {product.productHuntUrl && (
                  <a
                    href={product.productHuntUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-500" /> Product Hunt Launch
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {product.socialLinks?.twitter && (
                  <a
                    href={product.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-sky-500" /> Twitter / X Profile
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {product.socialLinks?.discord && (
                  <a
                    href={product.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-indigo-500" /> Discord Community
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {product.socialLinks?.youtube && (
                  <a
                    href={product.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-500" /> YouTube Demo & Reviews
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {product.githubRepoUrl && (
                  <a
                    href={product.githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-500" /> Open Source GitHub
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Widget 4: Related Trending Ticker (Doodle Card) */}
            <div className="doodle-card p-6 space-y-3">
              <h3 className="font-extrabold text-sm doodle-font text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" /> Related Launches
              </h3>
              <div className="space-y-2.5">
                {similarProducts.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/producthunt/${p.slug || p.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200/60 dark:border-white/5 hover:border-rose-500/40 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs doodle-font text-[var(--foreground)] truncate group-hover:text-rose-500 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-[var(--muted)] font-mono">
                        ▲ {p.votesCount.toLocaleString()} upvotes
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Maker Interactive Graph & Portfolio Modal */}
        {selectedMaker && (
          <MakerPortfolioModal
            maker={selectedMaker}
            currentProduct={product}
            onClose={() => setSelectedMaker(null)}
          />
        )}

        {/* OSS Modal */}
        <TechStackLinker
          startup={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            logo: product.logo,
            batch: product.ycBatch || "W24",
            year: parseInt(product.launchDate.split("-")[0]) || 2024,
            season: "Winter",
            location: "San Francisco, CA",
            country: "United States",
            oneLiner: product.tagline,
            longDescription: product.description,
            website: product.websiteUrl,
            status: "Active",
            industries: [product.category],
            tags: product.topics,
            founders: product.makers.map((m) => ({ name: m.name, title: m.headline || "Maker" })),
          }}
          isOpen={isOssModalOpen}
          onClose={() => setIsOssModalOpen(false)}
        />
      </div>
    </div>
  );
}
