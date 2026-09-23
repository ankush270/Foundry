export type DomainCategory =
  | "Fintech"
  | "AI & Machine Learning"
  | "DevTools & Infrastructure"
  | "Healthtech & Bio"
  | "E-Commerce & Retail"
  | "Security & Privacy"
  | "Entertainment & Media"
  | "Gaming & Graphics"
  | "Data & Analytics"
  | "Productivity & SaaS"
  | "Web3 & Crypto";

export type MaturityLevel = "Battle-Tested" | "Production Viable" | "Emerging" | "Experimental";

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface MvpPathway {
  saasIdeaTitle: string;
  problemSolved: string;
  architectureBlueprint: string[];
  estimatedBuildTime: string;
  monetizationModel: string;
  missingComponentsToBuild: string[];
}

export interface SarvamExplainerPayload {
  whatItSolves: string;
  techStack: string[];
  maturity: MaturityLevel;
  whyRelevantToSearch: string;
  pros: string[];
  cons: string[];
  recommendedUseCases: string[];
}

export interface OssRepository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  avatarUrl: string;
  repoUrl: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  closedIssues: number;
  lastCommitDate: string;
  createdDate: string;
  license: string;
  language: string;
  domainCategory: DomainCategory;
  tags: string[];
  communityUseCases: string[];
  
  // Health & Quality Metrics
  qualityScore: number; // 0 - 100
  isUnderrated: boolean; // low stars (<1500) but high quality (>75)
  maintainerHealth: "Excellent" | "Good" | "Needs Attention" | "Inactive";
  monthlyCommitVelocity: number;
  starGrowthRate: number; // stars added per week
  relevanceMatchBadge?: string; // e.g. "🎯 Fintech Match (95%)"
  relevanceScore?: number; // 0 - 100
  
  // Sarvam AI Payload
  sarvamExplainer: SarvamExplainerPayload;
  mvpPathway: MvpPathway;
  integrationGuide: {
    installCommand: string;
    configSteps: string[];
    minimalSnippet: CodeSnippet;
  };
  readmeMarkdown: string;
}

export interface QaMessage {
  id: string;
  sender: "user" | "sarvam_ai";
  text: string;
  timestamp: string;
  codeSnippet?: CodeSnippet;
}

export interface LaunchRadarItem {
  id: string;
  repoName: string;
  fullName: string;
  repoUrl: string;
  description: string;
  domainCategory: DomainCategory;
  starsToday: number;
  totalStars: number;
  source: "GitHub Trending" | "Hacker News" | "Product Hunt";
  launchDate: string;
  tractionSignal: "Explosive Growth" | "High Traction" | "Early Signal";
  oneLiner: string;
}

export interface PersonalCollection {
  id: string;
  name: string;
  description: string;
  repoIds: string[];
  createdAt: string;
}
