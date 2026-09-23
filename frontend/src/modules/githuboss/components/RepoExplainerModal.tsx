"use client";

import React, { useState } from "react";
import { OssRepository, QaMessage } from "../types";
import { SarvamGithubService as SarvamService } from "@/services/github";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import TrifectaBadgeBanner from "@/modules/cross-intelligence/components/TrifectaBadgeBanner";
import { 

  X, Sparkles, Code2, Layers, Rocket, Check, Copy, 
  Send, ExternalLink, ShieldCheck, Cpu, Clock, DollarSign,
  AlertTriangle, Lightbulb
} from "lucide-react";

interface RepoExplainerModalProps {
  repo: OssRepository | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "explainer" | "integration" | "chat" | "mvp";
  userSearchQuery?: string;
}

export const RepoExplainerModal: React.FC<RepoExplainerModalProps> = ({
  repo,
  isOpen,
  onClose,
  initialTab = "explainer",
  userSearchQuery = "",
}) => {
  const [activeTab, setActiveTab] = useState<"explainer" | "integration" | "chat" | "mvp">(initialTab);
  const [chatMessages, setChatMessages] = useState<QaMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
    if (repo && chatMessages.length === 0) {
      setChatMessages([
        {
          id: "welcome-1",
          sender: "sarvam_ai",
          text: `Hi! I am Sarvam AI assistant for **${repo.name}**. Ask me any technical questions about installation, API configuration, performance characteristics, or real-world use cases.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [initialTab, repo]);

  // Auto-scroll to bottom of chat when new messages arrive
  React.useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab, isAsking]);

  if (!isOpen || !repo) return null;

  const handleSendQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim() || isAsking) return;

    const userMsg: QaMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const currentQ = inputQuestion;
    setInputQuestion("");
    setIsAsking(true);

    try {
      const res = await SarvamService.askRepoQuestion(repo, currentQ, chatMessages);
      const aiMsg: QaMessage = {
        id: (Date.now() + 1).toString(),
        sender: "sarvam_ai",
        text: res.answer,
        codeSnippet: res.codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto" data-lenis-prevent>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden" data-lenis-prevent>
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <img src={repo.avatarUrl} alt={repo.owner} className="w-9 h-9 rounded-xl border border-zinc-700 bg-zinc-800" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-zinc-100">{repo.name}</h2>
                <a
                  href={repo.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {repo.fullName} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-zinc-400 font-mono">{repo.domainCategory} • {repo.license} License</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-6 gap-2 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab("explainer")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition ${
              activeTab === "explainer"
                ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Plain Language Explainer</span>
          </button>

          <button
            onClick={() => setActiveTab("integration")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition ${
              activeTab === "integration"
                ? "border-emerald-400 text-emerald-400 bg-emerald-950/20"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Setup & Integration Guide</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition ${
              activeTab === "chat"
                ? "border-purple-400 text-purple-400 bg-purple-950/20"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>Ask-a-Question Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab("mvp")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition ${
              activeTab === "mvp"
                ? "border-amber-400 text-amber-400 bg-amber-950/20"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Rocket className="w-4 h-4 text-amber-400" />
            <span>"Build With This" MVP Pathway</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0" data-lenis-prevent>
          <div className="mb-2">
            <TrifectaBadgeBanner githubRepo={repo} />
          </div>

          {/* TAB 1: PLAIN LANGUAGE EXPLAINER */}

          {activeTab === "explainer" && (
            <div className="space-y-6">
              {/* Search Relevance Box */}
              {userSearchQuery && (
                <div className="rounded-xl bg-cyan-950/30 border border-cyan-800/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                    <span>Why it fits your query: "{userSearchQuery}"</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {repo.sarvamExplainer.whyRelevantToSearch}
                  </p>
                </div>
              )}

              {/* What It Solves */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" /> What this repo solves in plain English
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                  {repo.sarvamExplainer.whatItSolves}
                </p>
              </div>

              {/* Tech Stack & Maturity Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <span className="text-xs font-mono text-zinc-400 block mb-2">Tech Stack & Dependencies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.sarvamExplainer.techStack.map((tech, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-cyan-300 border border-zinc-700/60 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <span className="text-xs font-mono text-zinc-400 block mb-2">Production Maturity</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4" /> {repo.sarvamExplainer.maturity}
                  </span>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-950/10 border border-emerald-900/30 rounded-xl">
                  <h5 className="text-xs font-semibold text-emerald-400 mb-2">Key Advantages (Pros)</h5>
                  <ul className="space-y-1.5">
                    {repo.sarvamExplainer.pros.map((pro, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-rose-950/10 border border-rose-900/30 rounded-xl">
                  <h5 className="text-xs font-semibold text-rose-400 mb-2">Considerations & Trade-offs (Cons)</h5>
                  <ul className="space-y-1.5">
                    {repo.sarvamExplainer.cons.map((con, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETUP & INTEGRATION GUIDE */}
          {activeTab === "integration" && (
            <div className="space-y-6">
              {/* Install Command */}
              <div>
                <span className="text-xs font-mono text-zinc-400 block mb-2">1. Installation Command</span>
                <div className="flex items-center justify-between p-3.5 bg-black rounded-xl border border-zinc-800 font-mono text-sm text-emerald-400">
                  <span>{repo.integrationGuide.installCommand}</span>
                  <button
                    onClick={() => handleCopyCode(repo.integrationGuide.installCommand)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Setup Configuration Steps */}
              <div>
                <span className="text-xs font-mono text-zinc-400 block mb-2">2. Configuration Blueprint</span>
                <ol className="space-y-2">
                  {repo.integrationGuide.configSteps.map((step, idx) => (
                    <li key={idx} className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/80 text-xs text-zinc-200 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Minimal Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-400">3. Minimal Working Code Snippet</span>
                  <span className="text-xs font-mono text-zinc-500">{repo.integrationGuide.minimalSnippet.title}</span>
                </div>
                <div className="relative rounded-xl bg-black border border-zinc-800 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
                  <button
                    onClick={() => handleCopyCode(repo.integrationGuide.minimalSnippet.code)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 transition"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <pre>{repo.integrationGuide.minimalSnippet.code}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASK-A-QUESTION Q&A CHAT */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-[480px] min-h-0">
              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 min-h-0" data-lenis-prevent>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-purple-600/30 text-purple-100 border border-purple-500/40 rounded-br-none"
                          : "bg-zinc-950/80 text-zinc-200 border border-zinc-800 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-zinc-400">
                        {msg.sender === "sarvam_ai" ? (
                          <span className="text-purple-400 flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3 h-3" /> Sarvam AI Docs Assistant
                          </span>
                        ) : (
                          <span>You</span>
                        )}
                        <span>• {msg.timestamp}</span>
                      </div>
                      <MarkdownRenderer content={msg.text} />

                      {msg.codeSnippet && (
                        <div className="mt-3 p-3 bg-black rounded-xl border border-zinc-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                          <pre>{msg.codeSnippet.code}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isAsking && (
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-mono animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" /> Sarvam AI analyzing documentation...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendQuestion} className="flex gap-2 pt-2 border-t border-zinc-800">
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder={`Ask anything about ${repo.name} (e.g. "How to handle reconnect logic?", "Is it free for commercial use?")`}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isAsking || !inputQuestion.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: "BUILD WITH THIS" MVP PATHWAY FOR FOUNDERS */}
          {activeTab === "mvp" && (
            <div className="space-y-6">
              {/* SaaS Idea Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 to-amber-900/10 border border-amber-800/40">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <Rocket className="w-4 h-4" /> Founder Startup Blueprint
                </div>
                <h3 className="text-base font-bold text-amber-200 mb-2">
                  {repo.mvpPathway.saasIdeaTitle}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {repo.mvpPathway.problemSolved}
                </p>
              </div>

              {/* Architecture Blueprint Steps */}
              <div>
                <h4 className="text-xs font-mono text-zinc-400 mb-3">MVP Technical Implementation Steps</h4>
                <div className="space-y-2">
                  {repo.mvpPathway.architectureBlueprint.map((step, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-mono">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Build Time & Monetization Model */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-400" />
                  <div>
                    <span className="text-[11px] font-mono text-zinc-400 block">Est. Time to Launch MVP</span>
                    <span className="text-sm font-bold text-zinc-100">{repo.mvpPathway.estimatedBuildTime}</span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  <div>
                    <span className="text-[11px] font-mono text-zinc-400 block">Recommended Monetization</span>
                    <span className="text-sm font-bold text-zinc-100">{repo.mvpPathway.monetizationModel}</span>
                  </div>
                </div>
              </div>

              {/* Missing Components To Build */}
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                <h5 className="text-xs font-mono text-zinc-400 mb-2">Components You Need to Code Yourself</h5>
                <ul className="space-y-1.5">
                  {repo.mvpPathway.missingComponentsToBuild.map((item, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
