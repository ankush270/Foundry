"use client";

import React from "react";

interface FoundryLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

export default function FoundryLogo({
  size = "md",
  showText = true,
  className = "",
  animated = true,
}: FoundryLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const subtextSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Logo Icon Mark */}
      <div className={`relative ${iconSizes[size]} shrink-0`}>
        {/* Ambient Glow behind logo */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500 ${
            animated ? "animate-pulse" : ""
          }`}
        />

        {/* SVG Container */}
        <div className="relative w-full h-full bg-slate-950 dark:bg-slate-900 rounded-xl p-1.5 border border-indigo-500/30 shadow-xl overflow-hidden group-hover:scale-105 group-hover:border-indigo-400/80 transition-all duration-300">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          >
            <defs>
              {/* Electric Forge Gradients */}
              <linearGradient
                id="forgeGradientPrimary"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>

              <linearGradient
                id="emberFlameGradient"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FDE047" />
              </linearGradient>

              <linearGradient
                id="techFacet"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Cyber Shield / Hexagonal Anvil Base */}
            <path
              d="M50 8 L85 28 V72 L50 92 L15 72 V28 Z"
              fill="url(#techFacet)"
              stroke="url(#forgeGradientPrimary)"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Outer Tech Circuit Accents */}
            <path
              d="M50 16 L77 32 V68 L50 84 L23 68 V32 Z"
              stroke="#818CF8"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.6"
            />

            {/* Stylized Monogram F + Flame Core */}
            {/* Monogram Stem */}
            <path
              d="M34 30 H66 C70 30 72 32 70 36 L66 42 H46 V50 H60 C64 50 65 52 63 56 L60 60 H46 V72 C46 75 43 76 40 76 H34 C31 76 30 74 30 71 V34 C30 31 31 30 34 30 Z"
              fill="url(#forgeGradientPrimary)"
            />

            {/* Glowing Flame Ember Core */}
            <path
              d="M58 72 C58 72 50 65 50 56 C50 50 55 45 58 41 C61 45 66 48 66 56 C66 65 58 72 58 72 Z"
              fill="url(#emberFlameGradient)"
              className="group-hover:scale-110 origin-bottom transition-transform duration-300"
            />

            {/* Tech Nodes */}
            <circle cx="50" cy="16" r="3" fill="#38BDF8" />
            <circle cx="77" cy="32" r="3" fill="#F59E0B" />
            <circle cx="23" cy="68" r="3" fill="#818CF8" />
          </svg>
        </div>
      </div>

      {/* Typography Brand Name */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`doodle-font font-black tracking-tight ${textSizes[size]} text-slate-900 dark:text-white`}
            >
              FOUND
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
                RY
              </span>
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          </div>
          <span
            className={`font-mono font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 ${subtextSizes[size]}`}
          >
            Tech Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
