import type { Startup } from "@/data/types";
import type { OssRepository, DomainCategory } from "@/modules/githuboss/types";
import type { ProductHuntProduct } from "@/modules/producthunt/types";

/** A matched OSS repo with relevance context */
export interface RepoMatch {
  repo: OssRepository;
  relevanceScore: number; // 0-100
  matchReasons: string[];
  matchType: "tech-stack" | "same-problem" | "industry" | "keyword";
}

/** Architecture layer for building a startup */
export interface StackLayer {
  layer: "frontend" | "backend" | "database" | "ai-ml" | "devops" | "payments" | "analytics" | "auth" | "communication";
  label: string;
  icon: string;
  repos: RepoMatch[];
  description: string;
}

/** Full tech stack recommendation for a startup */
export interface TechStackRecommendation {
  startup: Startup;
  totalMatches: number;
  topRepos: RepoMatch[];        // Top 10 overall best matches
  sameProblemRepos: RepoMatch[]; // Repos solving the exact same problem
  buildWithRepos: StackLayer[];  // Repos organized by architecture layer
  searchQuery: string;           // GitHub search query to find more
  estimatedBuildTime: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

/** Industry to domain mapping */
export interface IndustryDomainMap {
  industry: string;
  domains: DomainCategory[];
  keywords: string[];
  githubTopics: string[];
}

/** 3-Way Trifecta Node Synergy Match (YC ↔ GitHub OSS ↔ Product Hunt) */
export interface TrifectaMatch {
  id: string;
  ycStartup: Startup;
  githubRepo: OssRepository;
  productHuntProduct: ProductHuntProduct;
  synergyScore: number; // 0 - 100
  synergyReasons: string[];
  builderPlaybook: {
    ycBusinessModel: string;      // Strategy & problem validation
    githubArchitecture: string;   // Code implementation & stack
    productHuntLaunchGtm: string; // Launch marketing & community hook
  };
}

/** Single item 3-pillar ecosystem resolution */
export interface ThreeWayNodeContext {
  primaryType: "yc" | "github" | "producthunt";
  ycStartup?: Startup;
  githubRepo?: OssRepository;
  productHuntProduct?: ProductHuntProduct;
  matchedYc: Startup[];
  matchedGithub: OssRepository[];
  matchedProductHunt: ProductHuntProduct[];
  bestTrifectaPair?: TrifectaMatch;
}

