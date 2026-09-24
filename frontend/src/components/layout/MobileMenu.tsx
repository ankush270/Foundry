"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Sun, Moon, Monitor, GitCompareArrows } from "lucide-react";
import { primaryNavLinks, moreNavLinks } from "./NavLinks";
import FoundryLogo from "@/components/ui/FoundryLogo";
import { useThemeStore } from "@/store/theme.store";
import { useCompareStore } from "@/store/compare.store";

interface Props {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, pathname, onClose }: Props) {
  const { theme, setTheme } = useThemeStore();
  const compareCount = useCompareStore((s) => s.selected.length);

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  const cycleTheme = () => {
    const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  };

  useEffect(() => {
    if (!isOpen) return;

    const lenis = typeof window !== "undefined" ? (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis : null;
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex flex-col justify-start animate-in fade-in duration-200"
      data-lenis-prevent
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer / Modal Container */}
      <div
        className="relative z-10 w-full max-h-[92vh] flex flex-col bg-white dark:bg-[#1E293B] border-b-4 border-[#263D5B] dark:border-[#49B6E5] shadow-[0_12px_32px_rgba(0,0,0,0.35)] overflow-hidden rounded-b-3xl animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Header with Brand Logo, Theme Toggle & Close Button */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60">
          <Link href="/" onClick={onClose} className="flex items-center">
            <FoundryLogo size="sm" />
          </Link>

          <div className="flex items-center gap-2">
            {compareCount > 0 && (
              <Link
                href="/compare"
                onClick={onClose}
                className="doodle-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-black bg-[#F97316] text-white border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B] rounded-lg"
              >
                <GitCompareArrows className="w-3.5 h-3.5" />
                <span>({compareCount})</span>
              </Link>
            )}

            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white shadow-[2px_2px_0px_0px_#263D5B] dark:shadow-[2px_2px_0px_0px_#49B6E5] hover:bg-[#49B6E5] transition-all"
              title={`Theme: ${theme}`}
              aria-label="Toggle theme"
            >
              <ThemeIcon className="w-4 h-4 text-current" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white shadow-[2px_2px_0px_0px_#263D5B] dark:shadow-[2px_2px_0px_0px_#49B6E5] hover:bg-rose-500 hover:text-white transition-all"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="overflow-y-auto px-4 py-4 space-y-5 max-h-[calc(92vh-4.5rem)]">
          {/* Main Primary Navigation */}
          <div>
            <div className="doodle-font text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider px-2 mb-2">
              Main Hubs
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {primaryNavLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`doodle-font flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-black transition-all ${
                      active
                        ? "bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[3px_3px_0px_0px_#263D5B]"
                        : "text-[#263D5B] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-[#263D5B]" : "text-[#49B6E5]"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ecosystem Tools & Analytics */}
          <div>
            <div className="doodle-font text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider px-2 mb-2">
              Ecosystem Analytics & Tools
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moreNavLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      active
                        ? "bg-[#49B6E5]/20 text-[#263D5B] dark:text-[#49B6E5] border-2 border-[#263D5B] dark:border-[#49B6E5]"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_0px_#263D5B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="doodle-font text-xs font-black leading-tight">{link.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 font-medium">{link.desc}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

