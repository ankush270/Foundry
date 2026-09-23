"use client";

import React, { useState } from "react";
import {
  X,
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
  UserCheck,
  Flame,
  Globe,
  Zap,
  BookOpen,
  DollarSign,
  Clock,
  Terminal,
} from "lucide-react";
import { ProductHuntProduct } from "@/modules/producthunt/types";
import TrifectaBadgeBanner from "@/modules/cross-intelligence/components/TrifectaBadgeBanner";

interface ProductDetailModalProps {
  product: ProductHuntProduct | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "architecture" | "blueprint" | "qa"
  >("overview");

  // AI Q&A Chat State
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([
    {
      sender: "ai",
      text: `Hello! I am your Product Hunt Research Assistant. Ask me anything about ${product?.name}'s architecture, tech stack, monetization, or competitive strategy.`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!product) return null;

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Styled like YC Startup Detail Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] shrink-0">
          <div className="flex items-start gap-4 min-w-0">
            <img
              src={product.logo}
              alt={product.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shrink-0 shadow-md bg-white dark:bg-white/5 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120";
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="font-display font-black text-2xl text-[var(--foreground)] truncate">
                  {product.name}
                </h2>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                    <Flame className="w-3.5 h-3.5" />
                    Featured Launch
                  </span>
                )}
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                  {product.category}
                </span>
              </div>
              <p className="text-sm font-medium text-[var(--muted)] truncate">
                {product.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            {product.websiteUrl && (
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                Visit Website
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector Navigation - YC Styled Pills */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/20 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Overview & Makers
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "architecture"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Cpu className="w-4 h-4" />
            AI Tech Explainer
          </button>
          <button
            onClick={() => setActiveTab("blueprint")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "blueprint"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            SaaS Clone Blueprint
          </button>
          <button
            onClick={() => setActiveTab("qa")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "qa"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Product Q&A
          </button>
        </div>

        {/* Modal Scrollable Body Content with min-h-0 flex-1 overflow-y-auto */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="mb-2">
            <TrifectaBadgeBanner productHuntProduct={product} />
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Media Gallery */}
              {product.mediaGallery.length > 0 && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black aspect-video max-h-72 shadow-md">
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

              {/* Stats Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs">
                <div>
                  <span className="text-[var(--muted)] block font-semibold mb-0.5">Upvotes</span>
                  <span className="font-extrabold text-base text-rose-500 font-mono">
                    ▲ {product.votesCount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block font-semibold mb-0.5">Comments</span>
                  <span className="font-extrabold text-base text-[var(--foreground)] font-mono">
                    💬 {product.commentsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block font-semibold mb-0.5">Pricing Model</span>
                  <span className="font-extrabold text-base text-emerald-500">
                    {product.pricingModel}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block font-semibold mb-0.5">Launch Date</span>
                  <span className="font-extrabold text-base text-[var(--foreground)]">
                    {product.launchedAtFormatted}
                  </span>
                </div>
              </div>

              {/* Description Card */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                <h3 className="text-sm font-extrabold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Product Description
                </h3>
                <p className="text-sm leading-relaxed text-[var(--foreground)] opacity-85">
                  {product.description}
                </p>
              </div>

              {/* Makers / Founders */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                  Makers & Founders
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.makers.map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
                    >
                      <img
                        src={
                          m.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                        }
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-[var(--foreground)] truncate">
                          {m.name}
                        </h4>
                        <p className="text-[11px] text-[var(--muted)] truncate">
                          {m.headline || `@${m.username}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Platform Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {product.githubRepoUrl && (
                  <a
                    href={product.githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    GitHub Repository
                  </a>
                )}
                {product.productHuntUrl && (
                  <a
                    href={product.productHuntUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-500 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Flame className="w-4 h-4" />
                    Product Hunt Page
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AI TECH EXPLAINER */}
          {activeTab === "architecture" && (
            <div className="space-y-6">
              {/* Problem Solved & UVP */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2">
                <span className="font-bold text-indigo-500 uppercase tracking-wider text-[10px]">
                  Core Value Proposition
                </span>
                <p className="font-extrabold text-base text-[var(--foreground)]">
                  {product.aiExplainer.uniqueValueProp}
                </p>
                <p className="text-[var(--muted)] leading-relaxed text-xs sm:text-sm">
                  {product.aiExplainer.problemSolved}
                </p>
              </div>

              {/* Tech Stack Chips */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Architecture Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                  Architecture Breakdown
                </h4>
                <div className="space-y-2.5">
                  {product.aiExplainer.techArchitecture.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs flex items-start gap-2.5 text-[var(--foreground)] font-mono"
                    >
                      <Terminal className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2.5">
                  <h5 className="font-extrabold text-emerald-500 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Key Advantages (Pros)
                  </h5>
                  <ul className="space-y-1.5 text-[var(--foreground)]">
                    {product.aiExplainer.pros.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2.5">
                  <h5 className="font-extrabold text-rose-500 flex items-center gap-1.5 text-sm">
                    <Zap className="w-4 h-4" />
                    Trade-offs & Challenges (Cons)
                  </h5>
                  <ul className="space-y-1.5 text-[var(--foreground)]">
                    {product.aiExplainer.cons.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAAS CLONE BLUEPRINT */}
          {activeTab === "blueprint" && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-extrabold text-base text-[var(--foreground)] mb-0.5">
                    {product.cloneBlueprint.saasCloneTitle}
                  </h4>
                  <p className="text-[var(--muted)]">
                    Actionable technical roadmap to build a SaaS competitor or clone.
                  </p>
                </div>
                <div className="flex items-center gap-4 font-mono font-bold text-xs">
                  <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" />
                    {product.cloneBlueprint.estimatedBuildTime}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                    <DollarSign className="w-3.5 h-3.5" />
                    {product.cloneBlueprint.monetizationModel}
                  </span>
                </div>
              </div>

              {/* Required APIs */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                  Required Third-Party APIs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.cloneBlueprint.requiredApis.map((api) => (
                    <span
                      key={api}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold"
                    >
                      ⚡ {api}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Build Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                  Build Implementation Steps
                </h4>
                <div className="space-y-2.5">
                  {product.cloneBlueprint.architectureSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs text-[var(--foreground)] font-mono"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Schema Outline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                  Database Schema Outline (PostgreSQL)
                </h4>
                <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-white/10 space-y-1.5 overflow-x-auto">
                  {product.cloneBlueprint.databaseSchemaOutline.map((tbl, i) => (
                    <div key={i}>{tbl}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI PRODUCT Q&A CHATBOT */}
          {activeTab === "qa" && (
            <div className="flex flex-col h-[420px]">
              <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 mb-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                        <Bot className="w-4.5 h-4.5 text-rose-500" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${
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

              {/* Chat Input Bar */}
              <form onSubmit={handleSendQuery} className="flex gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask a question about ${product.name}...`}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-rose-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ask
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
