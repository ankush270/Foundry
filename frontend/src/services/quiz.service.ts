// ── Quiz logic service ──

import type { Startup } from "@/data/types";

export function generateHints(startup: Startup): string[] {
  return [
    `Industry: ${startup.industries.join(", ")}`,
    `Batch: ${startup.batch} (${startup.year})`,
    `Founders: ${startup.founders.length} founder${startup.founders.length > 1 ? "s" : ""}`,
    `Location: ${startup.location}`,
    `Status: ${startup.status}`,
    `"${startup.oneLiner}"`,
  ];
}

export function checkAnswer(guess: string, startup: Startup): boolean {
  return guess.toLowerCase().trim() === startup.name.toLowerCase().trim();
}

export function pickRandomStartup(pool: Startup[]): Startup {
  return pool[Math.floor(Math.random() * pool.length)];
}
