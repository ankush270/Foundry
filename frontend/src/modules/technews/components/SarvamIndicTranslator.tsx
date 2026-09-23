"use client";

import { useState } from "react";
import { SarvamTechNewsService } from "@/services/technews/sarvam-technews.service";
import { Globe, Sparkles, Loader2 } from "lucide-react";

interface SarvamIndicTranslatorProps {
  originalPremise: string;
  onTranslatedTextChange?: (text: string) => void;
}

export default function SarvamIndicTranslator({
  originalPremise,
  onTranslatedTextChange,
}: SarvamIndicTranslatorProps) {
  const [selectedLang, setSelectedLang] = useState<"en" | "hi" | "hinglish" | "ta" | "te" | "bn">("en");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "Hindi - हिंदी", flag: "🇮🇳" },
    { code: "hinglish", label: "Hinglish", flag: "🇮🇳" },
    { code: "ta", label: "Tamil - தமிழ்", flag: "🇮🇳" },
    { code: "te", label: "Telugu - తెలుగు", flag: "🇮🇳" },
    { code: "bn", label: "Bengali - বাংলা", flag: "🇮🇳" },
  ] as const;

  const handleLanguageSelect = async (code: typeof selectedLang) => {
    setSelectedLang(code);
    if (code === "en") {
      setTranslatedText("");
      if (onTranslatedTextChange) onTranslatedTextChange(originalPremise);
      return;
    }

    setLoading(true);
    try {
      const translated = await SarvamTechNewsService.translateToIndic(originalPremise, code);
      setTranslatedText(translated);
      if (onTranslatedTextChange) onTranslatedTextChange(translated);
    } catch (e) {
      console.error("Translation error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[3px_3px_0px_0px_#263D5B] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#49B6E5]" />
          <span className="doodle-font text-xs font-black text-[#263D5B] dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> Sarvam Indic AI Live Translator
          </span>
        </div>
        {loading && (
          <span className="text-[11px] font-bold text-[#49B6E5] flex items-center gap-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Translating...
          </span>
        )}
      </div>

      {/* Language Pills */}
      <div className="flex flex-wrap gap-1.5">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            disabled={loading}
            className={`doodle-font text-xs font-black px-3 py-1 rounded-xl border-2 transition-all flex items-center gap-1 ${
              selectedLang === lang.code
                ? "bg-[#49B6E5] text-[#263D5B] border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#263D5B]/20 hover:bg-slate-100"
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>

      {/* Translated Box Output */}
      {selectedLang !== "en" && translatedText && (
        <div className="p-3.5 rounded-xl bg-[#49B6E5]/10 border border-[#263D5B]/30 font-bold text-xs text-slate-800 dark:text-slate-100 leading-relaxed">
          <span className="doodle-badge text-[9px] bg-[#49B6E5] text-[#263D5B] px-1.5 py-0.2 rounded font-black mb-1 inline-block">
            Sarvam Indic AI ({selectedLang.toUpperCase()})
          </span>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}
