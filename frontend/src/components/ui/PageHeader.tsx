"use client";

import type { LucideIcon } from "lucide-react";
import { GsapTextReveal } from "@/components/animations/GsapTextReveal";

interface Props {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badgeText?: string;
}

export default function PageHeader({ title, subtitle, icon: Icon, badgeText }: Props) {
  return (
    <div className="mb-8">
      {badgeText && (
        <GsapTextReveal direction="down" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>{badgeText}</span>
          </div>
        </GsapTextReveal>
      )}

      <GsapTextReveal direction="up" delay={0.15}>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight mb-3 flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 shrink-0 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-white dark:bg-[#070A11] rounded-[10px] flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          )}
          <span className="gradient-text-indigo">{title}</span>
        </h1>
      </GsapTextReveal>

      {subtitle && (
        <GsapTextReveal direction="up" delay={0.25}>
          <p className="text-base sm:text-lg text-[var(--muted)] max-w-3xl font-normal leading-relaxed">
            {subtitle}
          </p>
        </GsapTextReveal>
      )}
    </div>
  );
}
