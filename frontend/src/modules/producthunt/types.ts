export type ProductCategory =
  | "All"
  | "AI & Machine Learning"
  | "DevTools & Infra"
  | "Productivity & SaaS"
  | "Design & Creative"
  | "Fintech & Web3"
  | "Marketing & Sales"
  | "No-Code & Mobile";

export type PricingModel = "Free" | "Freemium" | "Paid" | "Open Source";

export interface ProductMaker {
  name: string;
  username: string;
  headline?: string;
  avatar?: string;
  twitterUrl?: string;
  productHuntUrl?: string;
}

export interface ProductAiExplainer {
  problemSolved: string;
  uniqueValueProp: string;
  targetAudience: string[];
  whyItLaunched: string;
  techArchitecture: string[];
  pros: string[];
  cons: string[];
}

export interface ProductCloneBlueprint {
  saasCloneTitle: string;
  estimatedBuildTime: string;
  monetizationModel: string;
  requiredApis: string[];
  architectureSteps: string[];
  databaseSchemaOutline: string[];
  keyFeaturesChecklist: string[];
}

export interface ProductPricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface ProductKeyFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface ProductMakerComment {
  author: string;
  text: string;
  date?: string;
  avatar?: string;
}

export interface ProductSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  youtube?: string;
}

export interface ProductTechDetails {
  hosting?: string;
  framework?: string;
  database?: string;
  aiModels?: string[];
  compliance?: string[];
}

export interface ProductHuntProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  thumbnailUrl: string;
  mediaGallery: string[];
  votesCount: number;
  commentsCount: number;
  launchDate: string;
  launchedAtFormatted: string;
  featured: boolean;
  topics: string[];
  category: ProductCategory;
  makers: ProductMaker[];
  websiteUrl: string;
  productHuntUrl: string;
  pricingModel: PricingModel;
  techStack: string[];
  aiExplainer: ProductAiExplainer;
  cloneBlueprint: ProductCloneBlueprint;
  communityNotes: string[];
  githubRepoUrl?: string;
  ycBatch?: string;
  rating?: { score: number; count: number };
  badge?: string;
  makerComment?: ProductMakerComment;
  pricingTiers?: ProductPricingTier[];
  keyFeatures?: ProductKeyFeature[];
  socialLinks?: ProductSocialLinks;
  techDetails?: ProductTechDetails;
}

export interface ProductHuntFilterOptions {
  query?: string;
  category?: ProductCategory;
  topic?: string;
  pricingModel?: PricingModel | "All";
  timeframe?: "Today" | "This Week" | "Featured" | "Top Voted" | "All";
  sortBy?: "votes" | "date" | "comments" | "relevance";
  limit?: number;
  cursor?: string;
  refresh?: boolean;
}
