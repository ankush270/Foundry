import type { Startup } from "@/data/types";

/** Match AI terminology as words, never substrings such as retail or chain. */
export function isAIStartup(startup: Startup): boolean {
  return [...startup.industries, ...startup.tags, startup.oneLiner].some((text) =>
    /\b(ai|artificial intelligence|machine learning|deep learning|llms?|generative ai)\b/i.test(text)
  );
}
