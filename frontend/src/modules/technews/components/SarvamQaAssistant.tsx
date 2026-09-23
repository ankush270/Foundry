"use client";

import { useState } from "react";
import { TechNewsItem } from "@/modules/technews/types";
import { SarvamTechNewsService, SarvamQaMessage } from "@/services/technews/sarvam-technews.service";
import { Bot, Send, Sparkles, MessageSquare, Loader2, User } from "lucide-react";

interface SarvamQaAssistantProps {
  item: TechNewsItem;
}

export default function SarvamQaAssistant({ item }: SarvamQaAssistantProps) {
  const [messages, setMessages] = useState<SarvamQaMessage[]>([
    {
      id: "msg-0",
      sender: "sarvam",
      text: `Hello! I am **Sarvam AI**, your technical intelligence assistant. Ask me anything about **${item.title}**!`,
      timestamp: "Just now",
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "🔥 What are the biggest risks?",
    "🚀 How can a startup build on this?",
    "⚡ What is the core technical breakthrough?",
    "💰 What is the market & economic impact?",
  ];

  const handleSend = async (qText?: string) => {
    const query = (qText || inputQuestion).trim();
    if (!query || loading) return;

    const userMsg: SarvamQaMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setLoading(true);

    try {
      const answer = await SarvamTechNewsService.askArticleQuestion(item, query, messages);
      const sarvamMsg: SarvamQaMessage = {
        id: `sarvam-${Date.now()}`,
        sender: "sarvam",
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, sarvamMsg]);
    } catch (e) {
      console.error("Sarvam QA Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doodle-card p-6 bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[5px_5px_0px_0px_#263D5B] dark:shadow-[5px_5px_0px_0px_#49B6E5] space-y-4">
      <div className="flex items-center justify-between border-b-2 border-dashed border-[#263D5B]/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F97316] text-white border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="doodle-font text-lg font-black text-[#263D5B] dark:text-white flex items-center gap-2">
              Sarvam AI Article Intelligence Q&A
              <span className="doodle-badge text-[10px] bg-[#49B6E5] text-[#263D5B] px-2 py-0.5 rounded-full border border-[#263D5B]">
                Live Sarvam 105B
              </span>
            </h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Ask questions, query risks, or extract startup vectors from this article in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="doodle-btn text-xs font-black bg-slate-100 dark:bg-slate-800 text-[#263D5B] dark:text-slate-200 px-3 py-1.5 rounded-xl border border-[#263D5B]/30 hover:bg-[#49B6E5]/20 transition-all text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="space-y-3 max-h-80 overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-[#263D5B]/20 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-[#263D5B] text-xs font-black ${
                msg.sender === "user"
                  ? "bg-[#49B6E5] text-[#263D5B]"
                  : "bg-[#F97316] text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs font-bold leading-relaxed max-w-[85%] border-2 border-[#263D5B]/20 shadow-[2px_2px_0px_0px_#263D5B] ${
                msg.sender === "user"
                  ? "bg-[#49B6E5]/20 text-[#263D5B] dark:text-white"
                  : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <span className="text-[9px] font-bold text-slate-400 block mt-1 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#49B6E5] p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sarvam AI is analyzing article context...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask Sarvam AI any question about this article..."
          disabled={loading}
          className="doodle-card flex-1 px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-2 border-[#263D5B] dark:border-[#49B6E5] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputQuestion.trim()}
          className="doodle-btn px-4 py-2.5 bg-[#F97316] text-white text-xs font-black flex items-center gap-1.5 border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B] disabled:opacity-50"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
