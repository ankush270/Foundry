// ── Shared types for the entire application ──

export interface Founder {
  name: string;
  title: string;
  bio?: string;
  avatar?: string;
  linkedin?: string;
  twitter?: string;
}

export interface JobPosting {
  id: number | string;
  title: string;
  role?: string;
  location?: string;
  type?: string;
  salaryRange?: string;
  equityRange?: string;
  minExperience?: string;
  visa?: string;
  url?: string;
}

export interface NewsItem {
  title: string;
  url: string;
  date?: string;
}

export interface Startup {
  id: string;
  name: string;
  slug: string;
  logo: string;
  oneLiner: string;
  longDescription: string;
  batch: string;
  year: number;
  season: string;
  industries: string[];
  tags: string[];
  founders: Founder[];
  location: string;
  country: string;
  status: "Active" | "Acquired" | "Inactive" | "Public";
  website: string;
  teamSize?: string;
  fundingStage?: string;
  isHiring?: boolean;
  jobCount?: number;
  jobs?: JobPosting[];
  news?: NewsItem[];
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    crunchbase?: string;
  };
}

export interface HistoryEvent {
  year: number;
  title: string;
  description: string;
  startupSlug?: string;
  type: "founding" | "milestone" | "batch" | "acquisition" | "launch";
}

export interface LeaderboardEntry {
  startupSlug: string;
  name: string;
  category: string;
  metric: string;
  rank: number;
}

export interface Note {
  id: string;
  startupId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  industries: string[];
  batches: string[];
  statuses: string[];
  countries: string[];
  tags: string[];
  fundingStages: string[];
  isHiring: boolean | null;
  hasAI: boolean | null;
  yearRange: [number, number];
  sortBy: "relevance" | "name-asc" | "name-desc" | "year-desc" | "year-asc" | "team-desc" | "jobs-desc";
}

export const emptyFilters: Filters = {
  industries: [],
  batches: [],
  statuses: [],
  countries: [],
  tags: [],
  fundingStages: [],
  isHiring: null,
  hasAI: null,
  yearRange: [2005, 2026],
  sortBy: "relevance",
};
