"use client";

import { useState, useEffect } from "react";
import { TechNewsItem } from "@/modules/technews/types";
import { SarvamTechNewsService } from "@/services/technews/sarvam-technews.service";
import { Play, Pause, Volume2, Sparkles, Radio, Gauge } from "lucide-react";

interface SarvamAudioBriefingPlayerProps {
  item: TechNewsItem;
}

export default function SarvamAudioBriefingPlayer({ item }: SarvamAudioBriefingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [language, setLanguage] = useState<"en" | "hi" | "hinglish">("en");
  const [script, setScript] = useState<string>("");

  useEffect(() => {
    const rawScript = SarvamTechNewsService.generateAudioScript(item);
    setScript(rawScript);
  }, [item]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePlay = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Browser speech synthesis is not supported.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;

      if (language === "hi") {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-US";
      }

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="doodle-card p-5 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[5px_5px_0px_0px_#49B6E5] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#49B6E5] text-[#263D5B] border border-white">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="doodle-font text-sm font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F97316]" /> Sarvam AI Executive Voice Briefing
            </h4>
            <p className="text-[11px] font-bold text-slate-300">
              30-Second AI Voice Synthesis & Audio Overview
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
          {(["en", "hi", "hinglish"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                if (isPlaying) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
              }}
              className={`doodle-font text-[10px] font-black px-2.5 py-1 rounded-lg uppercase transition-all ${
                language === lang
                  ? "bg-[#49B6E5] text-[#263D5B]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={togglePlay}
            className={`doodle-btn p-3.5 rounded-2xl font-black flex items-center justify-center gap-2 border-2 border-white shadow-[3px_3px_0px_0px_#49B6E5] transition-all ${
              isPlaying
                ? "bg-[#F97316] text-white"
                : "bg-[#49B6E5] text-[#263D5B] hover:bg-[#3ca0cb]"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> Stop Briefing
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Listen Voice Briefing
              </>
            )}
          </button>

          {/* Equalizer Visualizer */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-6">
              <span className="w-1.5 bg-[#49B6E5] rounded-full animate-[bounce_0.8s_infinite_100ms] h-4" />
              <span className="w-1.5 bg-[#F97316] rounded-full animate-[bounce_0.8s_infinite_300ms] h-6" />
              <span className="w-1.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_200ms] h-3" />
              <span className="w-1.5 bg-[#49B6E5] rounded-full animate-[bounce_0.8s_infinite_400ms] h-5" />
            </div>
          )}
        </div>

        {/* Speed Multipliers */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="doodle-font text-[10px] font-black text-slate-400 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#49B6E5]" /> Speed:
          </span>
          {[1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                setSpeechRate(rate);
                if (isPlaying) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
              }}
              className={`doodle-font text-xs font-black px-2.5 py-1 rounded-lg border border-slate-600 ${
                speechRate === rate
                  ? "bg-[#49B6E5] text-[#263D5B] border-[#49B6E5]"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
