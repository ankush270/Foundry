"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Monitor, GitCompareArrows, Menu, X, Flame, ChevronDown, Layers } from "lucide-react";
import { useThemeStore } from "@/store/theme.store";
import { useCompareStore } from "@/store/compare.store";
import { primaryNavLinks, moreNavLinks } from "./NavLinks";
import MobileMenu from "./MobileMenu";
import GsapMagnetic from "@/components/animations/GsapMagnetic";
import FoundryLogo from "@/components/ui/FoundryLogo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useThemeStore();
  const compareCount = useCompareStore((s) => s.selected.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  const cycleTheme = () => {
    const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const bar = progressBarRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        },
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  const isMoreActive = moreNavLinks.some((link) => pathname === link.href);

  return (
    <>
      {/* Top GSAP Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-200 dark:bg-slate-800 pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-indigo-600 dark:bg-indigo-400 origin-left scale-x-0 transition-transform duration-75 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        />
      </div>

      <nav className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-6 max-w-[1440px] mx-auto font-sans">
        <div className="bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md rounded-2xl px-4 sm:px-6 border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[4px_4px_0px_0px_#263D5B] dark:shadow-[4px_4px_0px_0px_#49B6E5]">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo with GSAP Magnetic Hover */}
            <GsapMagnetic strength={0.2}>
              <Link href="/" className="flex items-center shrink-0">
                <FoundryLogo size="md" />
              </Link>
            </GsapMagnetic>

            {/* Desktop Streamlined Navigation Bar (Doodle Neobrutalist) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-xl border-2 border-[#263D5B]/30 dark:border-[#49B6E5]/40">
              {primaryNavLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`doodle-font flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-black tracking-wide transition-all duration-150 ${
                      active
                        ? "bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B] scale-105"
                        : "text-[#263D5B] dark:text-slate-200 hover:text-[#263D5B] dark:hover:text-white hover:bg-[#49B6E5]/20 hover:border-2 hover:border-[#263D5B]/40"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-[#263D5B]" : "text-current"}`} />
                    {link.label}
                  </Link>
                );
              })}

              {/* Dropdown for More Hubs (Doodle Style) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`doodle-font flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black tracking-wide transition-all duration-150 ${
                    isMoreActive || moreDropdownOpen
                      ? "bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shadow-[2px_2px_0px_0px_#263D5B]"
                      : "text-[#263D5B] dark:text-slate-200 hover:text-[#263D5B] dark:hover:text-white hover:bg-[#49B6E5]/20"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>More Hubs</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white dark:bg-[#1E293B] rounded-2xl border-2 border-[#263D5B] dark:border-[#49B6E5] shadow-[5px_5px_0px_0px_#263D5B] dark:shadow-[5px_5px_0px_0px_#49B6E5] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="doodle-font text-[10px] font-black text-[#263D5B] dark:text-[#49B6E5] px-3 py-1 uppercase tracking-wider border-b-2 border-dashed border-[#263D5B]/20 dark:border-[#49B6E5]/30 mb-1">
                      Ecosystem Analytics & Tools
                    </div>
                    {moreNavLinks.map((link) => {
                      const Icon = link.icon;
                      const active = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                            active
                              ? "bg-[#49B6E5]/20 text-[#263D5B] dark:text-[#49B6E5] font-black border-2 border-[#263D5B] dark:border-[#49B6E5]"
                              : "text-slate-700 dark:text-slate-200 hover:bg-[#49B6E5]/10 hover:text-[#263D5B] dark:hover:text-white"
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-[#49B6E5] text-[#263D5B] border-2 border-[#263D5B] shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_0px_#263D5B]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="doodle-font text-xs font-black leading-tight">{link.label}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight font-medium">{link.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right action tools (Doodle Neobrutalist Buttons) */}
            <div className="flex items-center gap-2.5">
              {compareCount > 0 && (
                <GsapMagnetic strength={0.3}>
                  <Link
                    href="/compare"
                    className="doodle-btn flex items-center gap-2 px-3.5 py-1.5 text-xs font-black animate-bounce bg-[#F97316] text-white border-2 border-[#263D5B] shadow-[2.5px_2.5px_0px_0px_#263D5B]"
                  >
                    <GitCompareArrows className="w-4 h-4" />
                    Compare ({compareCount})
                  </Link>
                </GsapMagnetic>
              )}

              <GsapMagnetic strength={0.25}>
                <button
                  onClick={cycleTheme}
                  className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white hover:bg-[#49B6E5] hover:text-[#263D5B] transition-all shadow-[2.5px_2.5px_0px_0px_#263D5B] dark:shadow-[2.5px_2.5px_0px_0px_#49B6E5]"
                  title={`Theme mode: ${theme}`}
                >
                  <ThemeIcon className="w-4 h-4 text-current" />
                </button>
              </GsapMagnetic>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-[#1E293B] border-2 border-[#263D5B] dark:border-[#49B6E5] text-[#263D5B] dark:text-white shadow-[2px_2px_0px_0px_#263D5B] dark:shadow-[2px_2px_0px_0px_#49B6E5] active:scale-95 transition-transform"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenu
        isOpen={mobileOpen}
        pathname={pathname}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
