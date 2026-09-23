"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ExternalLink, MapPin, Calendar, Users, Heart,
  GitCompareArrows, Globe, Building2, Sparkles, StickyNote,
  Trash2, Send, Briefcase, Newspaper, Code2, Bot, ChevronRight, Zap
} from "lucide-react";
import TechStackLinker from "@/modules/cross-intelligence/components/TechStackLinker";
import TrifectaBadgeBanner from "@/modules/cross-intelligence/components/TrifectaBadgeBanner";
import StartupBuilderChatbot from "./StartupBuilderChatbot";

import { getStartupBySlug, getSimilarStartups } from "@/lib/utils";
import { useCompareStore } from "@/store/compare.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { useNotesStore } from "@/store/notes.store";
import { STATUS_COLORS } from "@/lib/constants";
import StartupCard from "@/components/ui/startup-card";
import BackLink from "@/components/ui/BackLink";
import GsapCounter from "@/components/animations/GsapCounter";
import GsapMagnetic from "@/components/animations/GsapMagnetic";

export default function StartupDetailView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const startup = getStartupBySlug(slug);
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get("tab") : null;
  const validTabs = ["overview", "ai-builder", "jobs", "news", "notes", "similar", "oss"];
  const initialTab = (tabParam && validTabs.includes(tabParam) ? tabParam : "overview") as any;

  const { add, remove, isSelected } = useCompareStore();
  const { toggle, isWatched } = useWatchlistStore();
  const { addNote, deleteNote, getNotesForStartup } = useNotesStore();
  const [noteText, setNoteText] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "ai-builder" | "jobs" | "news" | "notes" | "similar" | "oss">(initialTab);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  const [isOssModalOpen, setIsOssModalOpen] = useState(false);

  if (!startup) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center doodle-card p-8 bg-white dark:bg-[#111827]">
          <h1 className="text-2xl font-bold doodle-font mb-2 text-[#263D5B] dark:text-[#49B6E5]">Startup Not Found</h1>
          <p className="text-[var(--muted)] mb-4 text-xs">The startup you&apos;re looking for doesn&apos;t exist in our database.</p>
          <Link href="/yc" className="doodle-btn px-4 py-2 text-xs inline-block">← Back to YC Explorer</Link>
        </div>
      </div>
    );
  }

  const similar = getSimilarStartups(startup, 4);
  const comparing = isSelected(startup.id);
  const watched = isWatched(startup.id);
  const startupNotes = getNotesForStartup(startup.id);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(startup.id, noteText.trim());
    setNoteText("");
  };

  const parsedTeamSize = startup.teamSize ? parseInt(startup.teamSize, 10) : 0;

  return (
    <div className="min-h-screen pb-16 pt-3 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-5">
        <BackLink />

        {/* Top Header Banner & Startup Title Card */}
        <div className="doodle-card p-6 sm:p-7 bg-[#FAF8F5] dark:bg-[#111827] space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <img
                src={startup.logo}
                alt={startup.name}
                loading="lazy"
                decoding="async"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#263D5B] dark:border-[#49B6E5] object-contain p-2 bg-white shrink-0 shadow-[3px_3px_0px_0px_#263D5B]"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black doodle-font text-[#263D5B] dark:text-white">
                    {startup.name}
                  </h1>
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full border-2 border-[#263D5B] doodle-badge ${STATUS_COLORS[startup.status] || "bg-[#49B6E5] text-[#263D5B]"}`}>
                    {startup.status}
                  </span>
                  {startup.isHiring && (
                    <span className="doodle-badge text-xs bg-[#16A34A] text-white">
                      Hiring ({startup.jobCount || (startup.jobs?.length || 1)} roles)
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                  {startup.oneLiner}
                </p>
              </div>
            </div>

            {/* Header Action CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <GsapMagnetic strength={0.25}>
                <button
                  onClick={() => setActiveTab("ai-builder")}
                  className="doodle-btn px-4 py-2.5 text-xs font-extrabold flex items-center gap-2 bg-[#49B6E5] text-[#263D5B]"
                >
                  <Bot className="w-4 h-4" /> Ask AI How to Build {startup.name}
                </button>
              </GsapMagnetic>

              <GsapMagnetic strength={0.25}>
                <button
                  onClick={() => toggle(startup.id)}
                  className={`doodle-btn px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5 ${
                    watched ? "bg-[#D97706] text-white" : "bg-white dark:bg-[#1F2937] text-[#263D5B] dark:text-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${watched ? "fill-white" : ""}`} />
                  {watched ? "Saved" : "Watchlist"}
                </button>
              </GsapMagnetic>

              <GsapMagnetic strength={0.25}>
                <button
                  onClick={() => comparing ? remove(startup.id) : add(startup)}
                  className={`doodle-btn px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5 ${
                    comparing ? "bg-[#D97706] text-white" : "bg-white dark:bg-[#1F2937] text-[#263D5B] dark:text-white"
                  }`}
                >
                  <GitCompareArrows className="w-4 h-4" />
                  {comparing ? "Comparing" : "Compare"}
                </button>
              </GsapMagnetic>

              {startup.website && (
                <GsapMagnetic strength={0.25}>
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doodle-btn px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5 bg-[#263D5B] text-white dark:bg-[#49B6E5] dark:text-[#263D5B]"
                  >
                    <Globe className="w-4 h-4" /> Website <ExternalLink className="w-3 h-3" />
                  </a>
                </GsapMagnetic>
              )}
            </div>
          </div>
        </div>

        {/* Main 2-Column Balanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (Main Content - 8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Tab Navigation Bar */}
            <div className="flex gap-1.5 border-b-2 border-dashed border-[#263D5B]/20 pb-3 overflow-x-auto custom-scrollbar" data-lenis-prevent>
              {[
                { id: "overview", label: "Overview", icon: Building2 },
                { id: "ai-builder", label: "🤖 AI Build Assistant", icon: Bot },
                { id: "oss", label: "Open Source Tech Stack", icon: Code2 },
                { id: "jobs", label: `Jobs (${startup.jobs?.length || 0})`, icon: Briefcase },
                { id: "news", label: `News (${startup.news?.length || 0})`, icon: Newspaper },
                { id: "notes", label: `Notes (${startupNotes.length})`, icon: StickyNote },
                { id: "similar", label: "Similar Startups", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold doodle-font whitespace-nowrap transition-all ${
                      active
                        ? "bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                        : "text-[var(--muted)] hover:text-[#263D5B] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-5">
                {/* About Card */}
                <div className="doodle-card p-5 sm:p-6 bg-white dark:bg-[#1F2937] space-y-3">
                  <h3 className="doodle-font font-black text-lg text-[#263D5B] dark:text-[#49B6E5] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#49B6E5]" /> About {startup.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                    {startup.longDescription || startup.oneLiner}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {startup.industries.map((ind) => (
                      <span key={ind} className="doodle-badge text-[11px] bg-[#49B6E5]/15 text-[#263D5B] dark:text-[#49B6E5]">
                        {ind}
                      </span>
                    ))}
                    {startup.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-[var(--muted)]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Founders & Leadership Grid (Balanced 2-col) */}
                {startup.founders && startup.founders.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="doodle-font font-black text-base text-[#263D5B] dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#49B6E5]" /> Founders & Leadership
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {startup.founders.map((f, i) => (
                        <div key={i} className="doodle-card p-4 bg-white dark:bg-[#1F2937] flex items-start gap-3">
                          <img
                            src={f.avatar || startup.logo}
                            alt={f.name}
                            loading="lazy"
                            decoding="async"
                            className="w-12 h-12 rounded-xl border-2 border-[#263D5B] dark:border-[#49B6E5] object-cover shrink-0 shadow-[2px_2px_0px_0px_#263D5B]"
                          />
                          <div className="min-w-0">
                            <p className="doodle-font font-extrabold text-sm text-[#263D5B] dark:text-white truncate">
                              {f.name}
                            </p>
                            <p className="text-xs font-bold text-[#D97706]">{f.title || "Founder"}</p>
                            {f.bio && (
                              <p className="text-xs text-[var(--muted)] mt-1 leading-snug line-clamp-2">
                                {f.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Build with OSS Banner */}
                <div className="doodle-card p-5 bg-[#FAF8F5] dark:bg-[#111827] flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1 max-w-md">
                    <h4 className="doodle-font font-black text-sm text-[#263D5B] dark:text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#16A34A]" /> Open Source Architecture
                    </h4>
                    <p className="text-xs text-[var(--muted)]">
                      Explore production-ready open source code repos for building {startup.name}.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOssModalOpen(true)}
                    className="doodle-btn px-4 py-2 text-xs font-bold bg-[#16A34A] text-white flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5" /> OSS Explorer
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AI Builder */}
            {activeTab === "ai-builder" && (
              <StartupBuilderChatbot startup={startup} />
            )}

            {/* TAB CONTENT: Jobs */}
            {activeTab === "jobs" && (
              <div className="space-y-3">
                {startup.jobs && startup.jobs.length > 0 ? (
                  <div className="space-y-3">
                    {startup.jobs.map((job) => (
                      <div key={job.id} className="doodle-card p-4 bg-white dark:bg-[#1F2937] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="doodle-font font-bold text-sm text-[#263D5B] dark:text-white mb-1">{job.title || job.role}</h4>
                          <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                            {job.location && <span>📍 {job.location}</span>}
                            {job.type && <span>💼 {job.type}</span>}
                            {job.salaryRange && <span>💰 {job.salaryRange}</span>}
                          </div>
                        </div>
                        <a
                          href={job.url || startup.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doodle-btn px-3.5 py-1.5 bg-[#49B6E5] text-[#263D5B] text-xs font-bold shrink-0"
                        >
                          Apply Now →
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 doodle-card bg-white dark:bg-[#1F2937]">
                    <p className="text-xs text-[var(--muted)]">No active job listings published at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: News */}
            {activeTab === "news" && (
              <div className="space-y-3">
                {startup.news && startup.news.length > 0 ? (
                  <div className="space-y-2">
                    {startup.news.map((item, i) => (
                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doodle-card p-3.5 bg-white dark:bg-[#1F2937] flex items-center justify-between gap-3 group"
                      >
                        <div>
                          <p className="doodle-font font-bold text-xs sm:text-sm text-[#263D5B] dark:text-white group-hover:text-[#49B6E5] transition-colors">{item.title}</p>
                          {item.date && <p className="text-[10px] text-[var(--muted)] mt-0.5">{item.date}</p>}
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#49B6E5] shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 doodle-card bg-white dark:bg-[#1F2937]">
                    <p className="text-xs text-[var(--muted)]">No recent news articles logged for this startup.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Notes */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="doodle-card p-4 bg-white dark:bg-[#1F2937]">
                  <h4 className="doodle-font font-bold text-xs text-[#263D5B] dark:text-white mb-2">Add Private Note</h4>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write investment notes or founder thesis..."
                    className="w-full h-20 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-[#263D5B] text-xs focus:outline-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button onClick={handleAddNote} className="doodle-btn px-4 py-1.5 text-xs font-bold flex items-center gap-1.5">
                      <Send className="w-3 h-3" /> Save Note
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {startupNotes.map((note) => (
                    <div key={note.id} className="doodle-card p-3.5 bg-white dark:bg-[#1F2937] flex justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#263D5B] dark:text-white whitespace-pre-line">{note.content}</p>
                        <p className="text-[10px] font-mono text-[var(--muted)] mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => deleteNote(note.id)} className="text-rose-500 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Open Source Tech Stack */}
            {activeTab === "oss" && (
              <TechStackLinker startup={startup} embedded={true} />
            )}

            {/* TAB CONTENT: Similar Startups */}
            {activeTab === "similar" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similar.map((s, i) => (
                  <StartupCard key={s.id} startup={s} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (Quick Intelligence & Ecosystem Stats - 4 cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            {/* Quick Intelligence Specs Card */}
            <div className="doodle-card p-5 bg-white dark:bg-[#1F2937] space-y-4">
              <h3 className="doodle-font font-black text-base text-[#263D5B] dark:text-[#49B6E5] border-b-2 border-dashed border-[#263D5B]/20 pb-2">
                Company Intelligence Specs
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#49B6E5]" /> Batch / Year
                  </span>
                  <span className="doodle-font font-bold text-[#263D5B] dark:text-white">
                    {startup.batch} ({startup.year})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#49B6E5]" /> Location
                  </span>
                  <span className="doodle-font font-bold text-[#263D5B] dark:text-white">
                    {startup.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] font-mono flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#49B6E5]" /> Team Size
                  </span>
                  <span className="doodle-font font-bold text-[#263D5B] dark:text-white">
                    {isNaN(parsedTeamSize) || parsedTeamSize === 0 ? startup.teamSize : <GsapCounter value={parsedTeamSize} />} employees
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] font-mono flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#49B6E5]" /> Funding Stage
                  </span>
                  <span className="doodle-font font-bold text-[#263D5B] dark:text-white">
                    {startup.fundingStage || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* 360 Trifecta Ecosystem Banner Widget */}
            <div className="space-y-2">
              <h4 className="doodle-font font-bold text-xs text-[#263D5B] dark:text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#49B6E5]" /> Ecosystem Synergy Matrix
              </h4>
              <TrifectaBadgeBanner ycStartup={startup} />
            </div>

            {/* Similar Startups Sidebar Widget */}
            <div className="doodle-card p-4 bg-white dark:bg-[#1F2937] space-y-3">
              <h3 className="doodle-font font-black text-sm text-[#263D5B] dark:text-white flex items-center justify-between">
                <span>Similar YC Companies</span>
                <Link href="/yc" className="text-[10px] font-mono text-[#49B6E5] hover:underline">View All →</Link>
              </h3>

              <div className="space-y-2">
                {similar.map((s) => (
                  <Link
                    key={s.id}
                    href={`/startup/${s.slug || s.id}`}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={s.logo} alt={s.name} className="w-7 h-7 rounded-lg border border-[#263D5B] object-contain p-0.5 bg-white shrink-0" />
                      <div className="min-w-0">
                        <p className="doodle-font font-bold text-xs text-[#263D5B] dark:text-white group-hover:text-[#49B6E5] truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-[var(--muted)] font-mono truncate">{s.batch}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* OSS Tech Stack Modal */}
        <TechStackLinker
          startup={startup}
          isOpen={isOssModalOpen}
          onClose={() => setIsOssModalOpen(false)}
        />
      </div>
    </div>
  );
}
