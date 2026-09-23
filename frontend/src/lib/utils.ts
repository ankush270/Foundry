// ── Data utility functions (extracted from data/startups.ts) ──

import { startups } from "@/data/startups";
import type { Startup } from "@/data/types";

export function getAllIndustries(): string[] {
  const set = new Set<string>();
  startups.forEach((s) => s.industries.forEach((i) => set.add(i)));
  return Array.from(set).sort();
}

export function getAllBatches(): string[] {
  const set = new Set<string>();
  startups.forEach((s) => set.add(s.batch));
  return Array.from(set).sort();
}

export function getAllCountries(): string[] {
  const set = new Set<string>();
  startups.forEach((s) => set.add(s.country));
  return Array.from(set).sort();
}

export function getAllStatuses(): string[] {
  return ["Active", "Public", "Acquired", "Inactive"];
}

export function getAllFundingStages(): string[] {
  const set = new Set<string>();
  startups.forEach((s) => {
    if (s.fundingStage) set.add(s.fundingStage);
  });
  return Array.from(set).sort();
}

export function getTopTags(): string[] {
  const counts = new Map<string, number>();
  startups.forEach((s) => {
    s.tags.forEach((t) => {
      counts.set(t, (counts.get(t) || 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t)
    .slice(0, 15);
}

export function getStartupBySlug(slug: string): Startup | undefined {
  return startups.find((s) => s.slug === slug);
}

export function getRandomStartup(filters?: {
  industry?: string;
  status?: string;
  batch?: string;
}): Startup {
  let filtered = startups;
  if (filters?.industry) filtered = filtered.filter((s) => s.industries.includes(filters.industry!));
  if (filters?.status) filtered = filtered.filter((s) => s.status === filters.status);
  if (filters?.batch) filtered = filtered.filter((s) => s.batch === filters.batch);
  if (filtered.length === 0) filtered = startups;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Common stop words to exclude from text similarity analysis
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself",
  "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most",
  "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "our", "ours",
  "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than", "that",
  "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those",
  "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where",
  "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves",
  // Generic company filler words
  "company", "startup", "platform", "solution", "solutions", "service", "services", "system", "systems",
  "business", "businesses", "technology", "technologies", "product", "products", "build", "building",
  "helps", "helping", "allows", "enables", "connecting", "connects", "based", "founded", "read", "more"
]);

// Generic metadata tags to ignore for similarity calculations
const META_TAGS = new Set([
  "top company", "unicorn", "public company", "hiring now", "active", "acquired", "inactive", "public"
]);

function extractKeywords(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/);

  const freqMap = new Map<string, number>();
  for (const word of words) {
    if (word.length > 2 && !STOP_WORDS.has(word)) {
      freqMap.set(word, (freqMap.get(word) || 0) + 1);
    }
  }
  return freqMap;
}

function calculateCosineSimilarity(mapA: Map<string, number>, mapB: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [word, countA] of mapA.entries()) {
    normA += countA * countA;
    const countB = mapB.get(word);
    if (countB) {
      dotProduct += countA * countB;
    }
  }

  for (const countB of mapB.values()) {
    normB += countB * countB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function getSimilarStartups(startup: Startup, limit = 5): Startup[] {
  const targetText = `${startup.oneLiner} ${startup.longDescription} ${startup.industries.join(" ")}`;
  const targetKeywords = extractKeywords(targetText);

  const targetIndustries = new Set(startup.industries.map(i => i.toLowerCase()));
  const targetTags = new Set(
    startup.tags
      .map(t => t.toLowerCase())
      .filter(t => !META_TAGS.has(t))
  );

  return startups
    .filter((s) => s.id !== startup.id)
    .map((s) => {
      let score = 0;

      // 1. Industry Jaccard Similarity (Weight: max 40 pts)
      const currentIndustries = s.industries.map(i => i.toLowerCase());
      const industryMatches = currentIndustries.filter(i => targetIndustries.has(i)).length;
      if (industryMatches > 0 && targetIndustries.size > 0) {
        const unionSize = new Set([...targetIndustries, ...currentIndustries]).size;
        const jaccard = industryMatches / unionSize;
        score += jaccard * 40;
      }

      // 2. Specific Non-Meta Tags Overlap (Weight: max 20 pts)
      const currentTags = s.tags
        .map(t => t.toLowerCase())
        .filter(t => !META_TAGS.has(t));
      const tagMatches = currentTags.filter(t => targetTags.has(t)).length;
      if (tagMatches > 0 && targetTags.size > 0) {
        const unionSize = new Set([...targetTags, ...currentTags]).size;
        const tagJaccard = tagMatches / unionSize;
        score += tagJaccard * 20;
      }

      // 3. Text & One-Liner Semantic Cosine Similarity (Weight: max 50 pts)
      const sText = `${s.oneLiner} ${s.longDescription} ${s.industries.join(" ")}`;
      const sKeywords = extractKeywords(sText);
      const cosineSim = calculateCosineSimilarity(targetKeywords, sKeywords);
      score += cosineSim * 50;

      return { ...s, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...s }) => s as Startup);
}

