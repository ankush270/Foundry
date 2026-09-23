export type NewsCategory =
  | "AI & Autonomous Systems"
  | "DevTools & Cloud Native"
  | "Data Engine & Databases"
  | "Cybersecurity & Zero Trust"
  | "Frontend & Modern Web"
  | "Enterprise & Architecture";

export type ImpactLevel = "Critical" | "High" | "Medium";

export type SourceType =
  | "Engineering Blog"
  | "Tech Media"
  | "Open Source Release"
  | "Research Paper";

export interface OpenSourceProjectRef {
  name: string;
  repoUrl: string;
  description: string;
  stars?: number;
  language?: string;
}

export interface FoundryBreakdown {
  whatHappened: string;
  companiesInvolved: string[];
  newTechnology: {
    title: string;
    architecture: string;
    keyFeatures: string[];
  };
  marketImpact: {
    summary: string;
    affectedSectors: string[];
    disruptionVector: string;
  };
  developerImpact: {
    summary: string;
    workflowChanges: string[];
    paradigmShift: string;
  };
  startupOpportunities: {
    title: string;
    description: string;
    targetMarket: string;
    potentialValue: "High" | "Very High" | "Massive";
  }[];
  openSourceProjects: OpenSourceProjectRef[];
  skillsAndJobs: {
    roles: string[];
    skills: string[];
  };
}

export interface TechNewsItem {
  id: string;
  slug: string;
  title: string;
  premise: string;
  category: NewsCategory;
  impactLevel: ImpactLevel;
  source: {
    name: string;
    type: SourceType;
    url: string;
    logoUrl?: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  breakdown: FoundryBreakdown;
}

export interface TechNewsFilters {
  category: NewsCategory | "All";
  impactLevel: ImpactLevel | "All";
  sourceType: SourceType | "All";
  searchQuery: string;
  sortBy: "latest" | "impact" | "opportunities" | "trending";
}

export interface TechNewsStatsSummary {
  totalAnalyzed: number;
  criticalImpacts: number;
  whiteSpaceOpportunities: number;
  topTrendingSkills: string[];
}
