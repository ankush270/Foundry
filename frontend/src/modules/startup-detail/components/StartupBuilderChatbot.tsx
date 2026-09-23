"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, Bot, Send, User, Copy, Check, Terminal, Layers,
  Zap, Code2, Database, ShieldAlert, Cpu, Rocket, ChevronRight,
  BookOpen, HelpCircle, RefreshCw, CheckCircle2, ArrowRight, ExternalLink,
  Flame, Globe, Wrench, Shield
} from "lucide-react";
import type { Startup } from "@/data/types";
import {
  getStartupArchitectureContext,
  generateChatResponse,
  ChatMessage,
  ArchitectureBlueprint
} from "@/lib/startup-architecture-engine";

interface Props {
  startup: Startup;
}

type MainSubTab = "chat" | "stack" | "apis" | "schema" | "challenges" | "roadmap";

export default function StartupBuilderChatbot({ startup }: Props) {
  const blueprint: ArchitectureBlueprint = getStartupArchitectureContext(startup);

  const [activeTab, setActiveTab] = useState<MainSubTab>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "initial-welcome",
      sender: "bot",
      text: `👋 **Welcome!** I am your **AI System Architect for ${startup.name}**.\n\nI have loaded the full system blueprint, database entities, third-party APIs, and engineering bottlenecks for **${startup.name}** (*${startup.oneLiner}*).\n\nYou can ask me **anything** about how to build a clone or competitor — tech stack decisions, database schemas, double-booking prevention, payment payouts, map integration, or code examples!\n\n👇 **Select a quick prompt or type your question below:**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Simulate AI thinking & streaming response
    setTimeout(() => {
      const responseText = generateChatResponse(startup, text, messages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopyText = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyFullSql = () => {
    let sql = `-- PostgreSQL Full DDL Schema for ${startup.name}\n\n`;
    blueprint.dbSchema.forEach(t => {
      sql += `-- Table: ${t.name}\nCREATE TABLE ${t.name} (\n`;
      t.columns.forEach((c, idx) => {
        sql += `  ${c.name.padEnd(20)} ${c.type.padEnd(22)} ${c.constraints || ""}${idx === t.columns.length - 1 ? "" : ","}\n`;
      });
      sql += `);\n\n`;
    });
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={startup.logo}
                alt={startup.name}
                className="w-16 h-16 rounded-2xl ring-4 ring-indigo-500/30 object-contain p-2 bg-white/10 shrink-0"
              />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h2 className="text-2xl font-extrabold font-display text-white tracking-tight">
                  Build {startup.name} Clone
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI System Architect
                </span>
              </div>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Complete technical blueprint & AI conversational assistant to build, scale, and launch a system like <strong className="text-white">{startup.name}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Complexity</span>
              <span className="text-xs font-extrabold text-amber-400">{blueprint.complexityLevel}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Est. MVP Build</span>
              <span className="text-xs font-extrabold text-emerald-400">{blueprint.estimatedBuildTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none" data-lenis-prevent>
        {[
          { id: "chat", label: "💬 AI Q&A Assistant", icon: Sparkles },
          { id: "stack", label: "🏗️ Tech Stack", icon: Layers, count: blueprint.techStack.length },
          { id: "apis", label: "🔌 Essential APIs", icon: Wrench, count: blueprint.essentialApis.length },
          { id: "schema", label: "𝌰 Database Schema", icon: Database, count: blueprint.dbSchema.length },
          { id: "challenges", label: "⚡ Key Engineering Bottlenecks", icon: ShieldAlert, count: blueprint.keyChallenges.length },
          { id: "roadmap", label: "🚀 MVP Roadmap", icon: Rocket, count: blueprint.mvpRoadmap.length },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MainSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/40"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE AI Q&A CHAT */}
      {activeTab === "chat" && (
        <div className="rounded-3xl border border-white/10 glass-card overflow-hidden flex flex-col h-[650px] shadow-2xl">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Architecture Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-400">Context active: {startup.name} system blueprint & code snippets</p>
              </div>
            </div>
            <button
              onClick={() => setMessages([{
                id: "welcome-reset",
                sender: "bot",
                text: `Chat reset! Ask me any question about technical design for **${startup.name}**.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }])}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Chat
            </button>
          </div>

          {/* Quick Preset Prompts Bar */}
          <div className="px-6 py-3 border-b border-white/5 bg-indigo-950/20 flex gap-2 overflow-x-auto scrollbar-none" data-lenis-prevent>
            <span className="text-xs text-indigo-300 font-bold flex items-center gap-1 shrink-0 py-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Prompts:
            </span>
            {blueprint.quickPrompts.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(promptText)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/25 hover:text-white whitespace-nowrap transition-all"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Messages Window */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5" data-lenis-prevent>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white"
                      : "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-1.5 flex-1 min-w-0 ${msg.sender === "user" ? "items-end text-right" : ""}`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] font-bold text-slate-400">
                      {msg.sender === "user" ? "You" : `${startup.name} System Architect`}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-tr-none shadow-lg shadow-orange-500/15"
                        : "bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none shadow-xl"
                    }`}
                  >
                    <RenderFormattedMarkdown content={msg.text} onCopy={handleCopyText} copiedId={copiedCodeId} />
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 font-medium ml-1">Analyzing architecture...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10 bg-slate-900/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask any architectural or code question about building ${startup.name}...`}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 shrink-0 transition-all"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: TECH STACK */}
      {activeTab === "stack" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-white/10 glass-card">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Recommended Stack for {startup.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated full-stack components optimized for high concurrency, developer velocity, and low operational cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blueprint.techStack.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/10 glass-card hover:border-indigo-500/40 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase tracking-wider border border-indigo-500/20">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Layer #{idx + 1}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-white">{item.name}</h4>
                  <p className="text-xs text-indigo-300 font-semibold mt-0.5">{item.recommendation}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  <strong className="text-slate-200">Why this choice:</strong> {item.why}
                </p>

                {item.ossAlternative && (
                  <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Open-Source Alternative: <strong>{item.ossAlternative}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ESSENTIAL APIS */}
      {activeTab === "apis" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-white/10 glass-card">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-400" /> Third-Party APIs & Integration Services
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Third-party cloud services required to avoid re-inventing complex infrastructure (Maps, Payments, SMS, Media).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {blueprint.essentialApis.map((api, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/10 glass-card space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                      <span>{api.name}</span>
                      <span className="text-xs font-normal text-slate-400">({api.provider})</span>
                    </h4>
                    <span className="text-xs text-purple-300 font-semibold">{api.category}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                    Integration API
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{api.purpose}</p>

                {api.exampleSnippet && (
                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                    <div className="px-3 py-1.5 bg-slate-900 border-b border-white/10 text-[11px] font-mono text-slate-400 flex justify-between items-center">
                      <span>Example Integration Code</span>
                      <button
                        onClick={() => handleCopyText(api.exampleSnippet!, `api-${idx}`)}
                        className="hover:text-white transition flex items-center gap-1"
                      >
                        {copiedCodeId === `api-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCodeId === `api-${idx}` ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <pre className="p-3 text-xs font-mono text-indigo-300 overflow-x-auto">
                      <code>{api.exampleSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE SCHEMA */}
      {activeTab === "schema" && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-white/10 glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" /> Relational SQL Schema Blueprint
              </h3>
              <p className="text-xs text-slate-400">Production-ready PostgreSQL database table structures with primary/foreign keys.</p>
            </div>
            <button
              onClick={handleCopyFullSql}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 shrink-0 transition"
            >
              {copiedSql ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? "Copied DDL Script!" : "Copy Full DDL SQL Script"}</span>
            </button>
          </div>

          <div className="space-y-4">
            {blueprint.dbSchema.map((table, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 glass-card overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono font-bold text-sm">TABLE {table.name}</span>
                    <span className="text-xs text-slate-400">— {table.description}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{table.columns.length} Columns</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Column Name</th>
                        <th className="py-2.5 px-4">Data Type</th>
                        <th className="py-2.5 px-4">Constraints</th>
                        <th className="py-2.5 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                      {table.columns.map((col, cIdx) => (
                        <tr key={cIdx} className="hover:bg-white/5 transition">
                          <td className="py-2.5 px-4 font-bold text-emerald-300">{col.name}</td>
                          <td className="py-2.5 px-4 text-purple-300">{col.type}</td>
                          <td className="py-2.5 px-4 text-amber-400/90 text-[11px]">{col.constraints || "—"}</td>
                          <td className="py-2.5 px-4 font-sans text-slate-400 text-xs">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: KEY BOTTLENECKS */}
      {activeTab === "challenges" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-white/10 glass-card">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" /> Key Engineering Challenges & Solutions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tackle complex technical hurdles like race conditions, geo-spatial indexing, and escrow payments with proven solutions.
            </p>
          </div>

          <div className="space-y-5">
            {blueprint.keyChallenges.map((ch, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/10 glass-card space-y-4">
                <h4 className="font-extrabold text-base text-amber-400">{ch.title}</h4>

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200 leading-relaxed">
                  <strong className="text-red-400">The Problem:</strong> {ch.problem}
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
                  <strong className="text-emerald-400">The Solution:</strong> {ch.solution}
                </div>

                {ch.codeSnippet && (
                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                    <div className="px-4 py-2 bg-slate-900 border-b border-white/10 text-xs font-mono text-slate-400 flex justify-between items-center">
                      <span>{ch.codeSnippet.filename || "Solution Snippet"}</span>
                      <button
                        onClick={() => handleCopyText(ch.codeSnippet!.code, `ch-${idx}`)}
                        className="hover:text-white transition flex items-center gap-1"
                      >
                        {copiedCodeId === `ch-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCodeId === `ch-${idx}` ? "Copied" : "Copy Code"}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{ch.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MVP ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-white/10 glass-card">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-emerald-400" /> Production MVP Build Schedule
            </h3>
            <p className="text-xs text-slate-400">Phase-by-phase execution plan to take a {startup.name} competitor from zero to live deployment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blueprint.mvpRoadmap.map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/10 glass-card hover:border-emerald-500/40 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/20">
                    {p.phase}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{p.duration}</span>
                </div>

                <h4 className="font-extrabold text-base text-white">{p.title}</h4>

                <ul className="space-y-2 text-xs text-slate-300">
                  {p.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Helper component to render rich markdown in chat messages */
function RenderFormattedMarkdown({
  content,
  onCopy,
  copiedId
}: {
  content: string;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        if (part.startsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const firstLine = lines[0] || "";
          const language = firstLine.match(/^[a-zA-Z0-9_-]+$/) ? firstLine : "";
          const codeBody = language ? lines.slice(1).join("\n") : lines.join("\n");
          const snippetId = `code-snippet-${idx}`;

          return (
            <div key={idx} className="my-3 rounded-xl overflow-hidden bg-slate-950 border border-white/15 shadow-xl text-left">
              <div className="px-3 py-1.5 bg-slate-900 border-b border-white/10 text-[11px] font-mono text-slate-400 flex justify-between items-center">
                <span>{language || "code"}</span>
                <button
                  onClick={() => onCopy(codeBody, snippetId)}
                  className="hover:text-white transition flex items-center gap-1"
                >
                  {copiedId === snippetId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === snippetId ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Standard prose text formatting with simple markdown rules
        const formattedText = part
          .split("\n")
          .map((line, lIdx) => {
            if (line.startsWith("### ")) {
              return <h3 key={lIdx} className="text-base font-extrabold text-white mt-2 mb-1">{line.replace("### ", "")}</h3>;
            }
            if (line.startsWith("#### ")) {
              return <h4 key={lIdx} className="text-sm font-bold text-indigo-300 mt-2 mb-1">{line.replace("#### ", "")}</h4>;
            }
            if (line.startsWith("> ")) {
              return (
                <div key={lIdx} className="my-2 p-2.5 rounded-lg bg-indigo-500/10 border-l-2 border-indigo-400 text-xs text-indigo-200">
                  {line.replace("> ", "")}
                </div>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <div key={lIdx} className="flex items-start gap-1.5 text-xs text-slate-300 my-0.5">
                  <span className="text-indigo-400">•</span>
                  <span>{renderInlineBold(line.replace("- ", ""))}</span>
                </div>
              );
            }
            return line.trim() ? <p key={lIdx} className="my-1">{renderInlineBold(line)}</p> : null;
          });

        return <div key={idx}>{formattedText}</div>;
      })}
    </div>
  );
}

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} className="text-white font-extrabold">{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-[12px]">{p.slice(1, -1)}</code>;
    }
    return p;
  });
}
