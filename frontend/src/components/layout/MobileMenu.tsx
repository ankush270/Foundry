"use client";

import { useEffect } from "react";
import Link from "next/link";
import { navLinks } from "./NavLinks";

interface Props {
  pathname: string;
  onClose: () => void;
}

export default function MobileMenu({ pathname, onClose }: Props) {
  useEffect(() => {
    const lenis = typeof window !== "undefined" ? (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis : null;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 md:hidden" onClick={onClose} data-lenis-prevent>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="absolute top-16 left-0 right-0 glass-strong border-b border-[var(--border-color)] p-4 max-h-[calc(100vh-4rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
