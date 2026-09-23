/**
 * Advanced Cross-Intelligence Matching Engine
 * High-Precision Mapping between YC Startups ↔ GitHub OSS Repositories
 * Detects true domain problem overlap, stack component fit, and anti-keywords.
 */

import type { Startup } from "@/data/types";
import type { OssRepository, DomainCategory } from "@/modules/githuboss/types";
import type { ProductHuntProduct } from "@/modules/producthunt/types";
import type {
  RepoMatch, StackLayer, TechStackRecommendation, IndustryDomainMap,
  TrifectaMatch, ThreeWayNodeContext, EcosystemRelationshipType,
  CompanyEcosystemSummary, EcosystemTreeNode, TechStackItem
} from "@/modules/cross-intelligence/types";

// ── Problem Domain Fingerprints ──

interface DomainFingerprint {
  id: string;
  name: string;
  keywords: string[];
  antiKeywords: string[];
  repoIds: string[]; // Ideal target repo IDs for this problem domain
}

const PROBLEM_FINGERPRINTS: DomainFingerprint[] = [
  {
    id: "lodging-rental-booking",
    name: "Accommodation & Rental Marketplace",
    keywords: ["accommodation", "accommodations", "lodging", "vacation rental", "rental marketplace", "booking", "book unique", "apartment", "castle", "villa", "night", "stay", "guest", "host", "extra space", "travel experiences", "airbnb"],
    antiKeywords: ["shopify", "storefront", "cart", "checkout", "physical product", "inventory", "stock market", "trading", "dicom"],
    repoIds: ["sharetribe-marketplace", "cal.com", "supabase", "hono", "supertokens-core", "posthog-analytics"]
  },
  {
    id: "food-delivery-logistics",
    name: "Food Delivery & On-Demand Logistics",
    keywords: ["restaurant delivery", "food delivery", "delivery", "logistics", "courier", "last-mile", "ordering", "kitchen", "fleet", "doordash", "ubereats"],
    antiKeywords: ["stock market", "trading", "dicom", "genomics", "shopify"],
    repoIds: ["sharetribe-marketplace", "n8n-automation", "posthog-analytics", "supabase", "hono"]
  },
  {
    id: "payments-billing-infrastructure",
    name: "Payments & Financial Infrastructure",
    keywords: ["economic infrastructure", "payments", "payment processing", "accept payments", "billing", "metered billing", "subscription management", "invoicing", "merchant", "stripe", "chargebee"],
    antiKeywords: ["accommodation", "lodging", "vacation rental", "dicom", "genomics"],
    repoIds: ["lago-billing", "yfinance-py", "supabase", "hono", "supertokens-core", "posthog-analytics"]
  },
  {
    id: "ecommerce-retail",
    name: "E-Commerce & Storefront Retail",
    keywords: ["ecommerce", "e-commerce", "storefront", "shopify", "shopping cart", "product catalog", "merchandise", "retail", "d2c", "inventory management", "checkout"],
    antiKeywords: ["accommodation", "lodging", "vacation rental", "hotel booking", "stock market", "trading", "dicom"],
    repoIds: ["medusa", "payload", "lago-billing", "supabase", "posthog-analytics"]
  },
  {
    id: "fintech-quant-trading",
    name: "Fintech & Quantitative Market Data",
    keywords: ["stock", "stocks", "trading", "market data", "backtest", "portfolio", "ticker", "investing", "options", "ohlcv", "brokerage", "financial data", "trading bot"],
    antiKeywords: ["accommodation", "lodging", "vacation rental", "hospital", "dicom", "storefront"],
    repoIds: ["yfinance-py", "algotrading-vectorbt", "openbb", "ccxt", "financial-agent-kit", "lago-billing"]
  },
  {
    id: "scheduling-appointments",
    name: "Scheduling & Appointment Booking",
    keywords: ["schedule", "scheduling", "appointment", "calendar", "time slots", "consultation", "booking link", "calendly"],
    antiKeywords: ["stock market", "trading", "dicom", "genomics"],
    repoIds: ["cal.com", "supabase", "hono", "supertokens-core"]
  },
  {
    id: "b2b-crm-sales",
    name: "B2B CRM & Sales Pipeline",
    keywords: ["crm", "sales pipeline", "lead management", "customer relationship", "deals", "contacts", "salesforce", "hubspot", "prospects", "outreach"],
    antiKeywords: ["accommodation", "lodging", "vacation rental", "stock market", "dicom"],
    repoIds: ["twenty-crm", "posthog-analytics", "n8n-automation", "supabase"]
  },
  {
    id: "workflow-automation",
    name: "Workflow & Integration Automation",
    keywords: ["workflow", "automation", "zapier", "integrations", "webhook", "trigger action", "no-code automation", "n8n"],
    antiKeywords: ["stock market", "dicom", "genomics"],
    repoIds: ["n8n-automation", "crewAI", "hono"]
  },
  {
    id: "ai-llm-agents",
    name: "AI Agents & LLM RAG Pipelines",
    keywords: ["llm", "ai agent", "multi-agent", "gpt", "rag", "embedding", "vector search", "langchain", "prompt", "nlp", "chatbot"],
    antiKeywords: ["dicom", "genomics", "storefront"],
    repoIds: ["crewAI", "ollama-js", "vanna", "langchain", "fast-embed-rust", "financial-agent-kit"]
  },
  {
    id: "healthtech-bio",
    name: "Healthcare, Bio & Medical Imaging",
    keywords: ["medical", "clinical", "hospital", "patient", "dicom", "pacs", "health", "dna", "crispr", "biotech", "genomics", "bioinformatics"],
    antiKeywords: ["stock market", "trading", "shopify", "storefront"],
    repoIds: ["orthanc-server", "monai", "biopython"]
  }
];

// ── Industry → GitHub Domain + Keywords Mapping ──

const INDUSTRY_DOMAIN_MAP: IndustryDomainMap[] = [
  {
    industry: "Fintech",
    domains: ["Fintech"],
    keywords: ["fintech", "payments", "banking", "stock", "trading", "finance", "billing", "invoicing", "lending", "insurance", "wealth", "investment", "portfolio"],
    githubTopics: ["fintech", "finance", "trading", "stock-market", "payments", "banking", "cryptocurrency"]
  },
  {
    industry: "B2B",
    domains: ["Productivity & SaaS", "DevTools & Infrastructure"],
    keywords: ["saas", "crm", "erp", "enterprise", "workflow", "automation", "b2b", "dashboard", "analytics", "reporting"],
    githubTopics: ["saas", "crm", "enterprise", "workflow", "automation", "dashboard"]
  },
  {
    industry: "Healthcare",
    domains: ["Healthtech & Bio"],
    keywords: ["health", "medical", "clinical", "patient", "hospital", "diagnosis", "telemedicine", "ehr", "pharma", "drug", "biotech"],
    githubTopics: ["healthcare", "medical", "health", "clinical", "bioinformatics"]
  },
  {
    industry: "AI",
    domains: ["AI & Machine Learning"],
    keywords: ["ai", "machine-learning", "deep-learning", "nlp", "llm", "gpt", "neural", "model", "inference", "training", "computer-vision", "chatbot"],
    githubTopics: ["ai", "machine-learning", "deep-learning", "nlp", "llm", "gpt", "transformer"]
  },
  {
    industry: "Developer Tools",
    domains: ["DevTools & Infrastructure"],
    keywords: ["devtools", "cli", "sdk", "api", "framework", "ide", "debugger", "testing", "ci-cd", "deployment", "monitoring", "logging"],
    githubTopics: ["devtools", "developer-tools", "cli", "sdk", "api", "framework"]
  },
  {
    industry: "E-Commerce",
    domains: ["E-Commerce & Retail"],
    keywords: ["ecommerce", "shopping", "cart", "checkout", "storefront", "shopify", "inventory", "catalog", "retail", "merchandise"],
    githubTopics: ["ecommerce", "e-commerce", "shopping", "storefront"]
  },
  {
    industry: "Consumer",
    domains: ["Productivity & SaaS", "Entertainment & Media"],
    keywords: ["consumer", "social", "mobile", "app", "community", "messaging", "content", "media", "lodging", "travel", "accommodation"],
    githubTopics: ["consumer", "social-media", "mobile"]
  },
  {
    industry: "Travel & Hospitality",
    domains: ["Productivity & SaaS"],
    keywords: ["travel", "lodging", "accommodation", "booking", "vacation rental", "hotel", "stay", "flight", "tour", "hospitality"],
    githubTopics: ["travel", "booking", "rental", "marketplace"]
  },
  {
    industry: "Food and beverage",
    domains: ["Productivity & SaaS"],
    keywords: ["food", "delivery", "restaurant", "ordering", "kitchen", "menu", "grocery"],
    githubTopics: ["food", "delivery", "restaurant"]
  },
  {
    industry: "Education",
    domains: ["Productivity & SaaS"],
    keywords: ["education", "edtech", "learning", "course", "lms", "quiz", "tutor", "school", "university", "classroom"],
    githubTopics: ["education", "edtech", "learning", "lms", "e-learning"]
  },
  {
    industry: "Security",
    domains: ["Security & Privacy"],
    keywords: ["security", "auth", "encryption", "privacy", "compliance", "identity", "sso", "oauth", "firewall", "threat"],
    githubTopics: ["security", "authentication", "encryption", "privacy", "cybersecurity"]
  },
  {
    industry: "Infrastructure",
    domains: ["DevTools & Infrastructure"],
    keywords: ["infrastructure", "cloud", "serverless", "kubernetes", "docker", "database", "storage", "cdn", "edge", "compute"],
    githubTopics: ["infrastructure", "cloud", "serverless", "kubernetes", "docker", "database"]
  },
  {
    industry: "Data Analytics",
    domains: ["Data & Analytics"],
    keywords: ["data", "analytics", "visualization", "bi", "etl", "pipeline", "warehouse", "dashboard", "metrics", "tracking"],
    githubTopics: ["data-analytics", "visualization", "etl", "business-intelligence"]
  },
  {
    industry: "Real Estate",
    domains: ["Productivity & SaaS", "Fintech"],
    keywords: ["real-estate", "property", "rental", "mortgage", "listing", "housing", "proptech"],
    githubTopics: ["real-estate", "proptech", "property"]
  }
];

// ── Stack Layer Definitions ──

const STACK_LAYER_KEYWORDS: Record<string, { label: string; icon: string; keywords: string[] }> = {
  "frontend": {
    label: "Frontend & UI",
    icon: "🎨",
    keywords: ["react", "vue", "angular", "svelte", "next", "nuxt", "tailwind", "ui", "component", "design-system", "css", "html", "web", "frontend", "dashboard"]
  },
  "backend": {
    label: "Backend & API",
    icon: "⚙️",
    keywords: ["api", "server", "express", "fastapi", "django", "flask", "hono", "framework", "rest", "graphql", "websocket", "microservice", "backend"]
  },
  "database": {
    label: "Database & Storage",
    icon: "🗄️",
    keywords: ["database", "sql", "postgres", "mysql", "mongodb", "redis", "supabase", "firebase", "orm", "prisma", "storage", "cache", "queue"]
  },
  "ai-ml": {
    label: "AI & Machine Learning",
    icon: "🧠",
    keywords: ["ai", "ml", "llm", "gpt", "langchain", "rag", "embedding", "transformer", "nlp", "computer-vision", "model", "neural", "inference"]
  },
  "devops": {
    label: "DevOps & Infrastructure",
    icon: "🚀",
    keywords: ["docker", "kubernetes", "ci-cd", "deploy", "monitoring", "terraform", "serverless", "edge", "cdn", "cloud"]
  },
  "payments": {
    label: "Payments & Billing",
    icon: "💳",
    keywords: ["payment", "stripe", "billing", "checkout", "subscription", "invoice", "wallet", "transaction"]
  },
  "analytics": {
    label: "Analytics & Tracking",
    icon: "📊",
    keywords: ["analytics", "tracking", "metrics", "dashboard", "reporting", "visualization", "chart", "graph", "session-recording"]
  },
  "auth": {
    label: "Auth & Identity",
    icon: "🔐",
    keywords: ["auth", "authentication", "authorization", "oauth", "sso", "jwt", "identity", "login", "user"]
  },
  "communication": {
    label: "Communication & Automation",
    icon: "💬",
    keywords: ["email", "sms", "notification", "push", "chat", "messaging", "webhook", "realtime", "workflow", "automation"]
  }
};

// ── Core Matching Logic ──

/**
 * Build a clean search query for GitHub based on startup characteristics
 */
export function buildGithubSearchQuery(startup: Startup): string {
  const parts: string[] = [];

  // Match industries
  for (const industry of startup.industries) {
    const mapping = INDUSTRY_DOMAIN_MAP.find(m =>
      m.industry.toLowerCase() === industry.toLowerCase() ||
      industry.toLowerCase().includes(m.industry.toLowerCase())
    );
    if (mapping) {
      parts.push(...mapping.keywords.slice(0, 2));
    }
  }

  // Detect fingerprint
  const startupText = `${startup.oneLiner} ${startup.longDescription}`.toLowerCase();
  for (const fp of PROBLEM_FINGERPRINTS) {
    const matchCount = fp.keywords.filter(kw => startupText.includes(kw)).length;
    if (matchCount >= 2) {
      parts.push(...fp.keywords.slice(0, 3));
      break;
    }
  }

  // Extract core non-stop words from one-liner
  const oneLinerWords = startup.oneLiner
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
  parts.push(...oneLinerWords.slice(0, 3));

  const unique = [...new Set(parts)];
  return unique.slice(0, 6).join(" ");
}

/**
 * Get the best matching DomainCategory for a startup
 */
export function getDomainsForStartup(startup: Startup): DomainCategory[] {
  const domains = new Set<DomainCategory>();
  const startupText = `${startup.oneLiner} ${startup.longDescription} ${startup.industries.join(" ")}`.toLowerCase();

  // Check fingerprints first
  for (const fp of PROBLEM_FINGERPRINTS) {
    const matches = fp.keywords.filter(kw => startupText.includes(kw)).length;
    if (matches >= 2) {
      if (fp.id === "lodging-rental-booking" || fp.id === "food-delivery-logistics" || fp.id === "b2b-crm-sales" || fp.id === "workflow-automation") {
        domains.add("Productivity & SaaS");
      } else if (fp.id === "ecommerce-retail") {
        domains.add("E-Commerce & Retail");
      } else if (fp.id === "fintech-quant-trading" || fp.id === "payments-billing-infrastructure") {
        domains.add("Fintech");
      } else if (fp.id === "ai-llm-agents") {
        domains.add("AI & Machine Learning");
      } else if (fp.id === "healthtech-bio") {
        domains.add("Healthtech & Bio");
      }
    }
  }

  // Industry map fallback
  for (const industry of startup.industries) {
    const mapping = INDUSTRY_DOMAIN_MAP.find(m =>
      m.industry.toLowerCase() === industry.toLowerCase() ||
      industry.toLowerCase().includes(m.industry.toLowerCase())
    );
    if (mapping) {
      mapping.domains.forEach(d => domains.add(d));
    }
  }

  if (domains.size === 0) {
    domains.add("Productivity & SaaS");
  }
  return Array.from(domains);
}

/**
 * Score how relevant an OSS repo is to a startup with high precision
 */
function scoreRepoRelevance(startup: Startup, repo: OssRepository): RepoMatch {
  let score = 0;
  const reasons: string[] = [];
  let matchType: RepoMatch["matchType"] = "tech-stack";

  const startupText = `${startup.name} ${startup.oneLiner} ${startup.longDescription} ${startup.industries.join(" ")} ${startup.tags.join(" ")}`.toLowerCase();
  const repoText = `${repo.id} ${repo.name} ${repo.description} ${repo.tags.join(" ")} ${repo.communityUseCases.join(" ")} ${repo.sarvamExplainer.whatItSolves}`.toLowerCase();

  // 1. Detect Problem Domain Fingerprint Match (weight: 45 + bonus)
  let matchedFingerprint: DomainFingerprint | null = null;
  let startupFpMatches = 0;

  for (const fp of PROBLEM_FINGERPRINTS) {
    const kwMatches = fp.keywords.filter(kw => startupText.includes(kw)).length;
    if (kwMatches >= 1 && kwMatches > startupFpMatches) {
      startupFpMatches = kwMatches;
      matchedFingerprint = fp;
    }
  }

  if (matchedFingerprint) {
    const isTargetRepo = matchedFingerprint.repoIds.includes(repo.id);
    const repoFpMatches = matchedFingerprint.keywords.filter(kw => repoText.includes(kw)).length;
    const hasAntiKeywordInRepo = matchedFingerprint.antiKeywords.some(akw => repoText.includes(akw));
    const hasAntiKeywordInStartup = matchedFingerprint.antiKeywords.some(akw => startupText.includes(akw));

    if (isTargetRepo) {
      score += 55; // Direct target repo bonus for this problem domain
      matchType = "same-problem";
      reasons.push(`Direct problem match: ${matchedFingerprint.name}`);
    } else if (repoFpMatches >= 2 && !hasAntiKeywordInRepo) {
      score += 40;
      matchType = "same-problem";
      reasons.push(`Domain solution fit: ${matchedFingerprint.name}`);
    } else if (hasAntiKeywordInRepo && !hasAntiKeywordInStartup) {
      // HEAVY PENALTY FOR DOMAIN MISMATCH (e.g. Medusa Shopify storefront for Airbnb accommodation rental)
      score -= 45;
      reasons.push(`Domain mismatch penalty (${matchedFingerprint.name} vs ${repo.domainCategory})`);
    }
  }

  // 2. Generic Keyword Overlap (weight: 20)
  const startupKeywords = extractKeywords(startupText);
  const repoKeywords = extractKeywords(repoText);
  const matchedWords: string[] = [];

  for (const [word] of startupKeywords) {
    if (GENERIC_META_WORDS.has(word)) continue;
    if (repoKeywords.has(word)) {
      matchedWords.push(word);
    }
  }

  const keywordScore = Math.min(20, matchedWords.length * 5);
  score += keywordScore;
  if (matchedWords.length > 0 && score > 0) {
    reasons.push(`Domain keywords: ${matchedWords.slice(0, 4).join(", ")}`);
  }

  // 3. Stack Component Fit (weight: 20)
  const isEssentialStack = EssentialStackRepos.has(repo.id);
  if (isEssentialStack) {
    score += 20;
    reasons.push(`Core architecture layer: ${repo.domainCategory}`);
  }

  // 4. Quality & Maintainer Bonus (weight: 10)
  const qualityBonus = (repo.qualityScore / 100) * 10;
  score += qualityBonus;

  // Clamp score between 0 and 100
  const finalScore = Math.max(0, Math.round(Math.min(100, score)));

  // Determine final matchType label
  if (matchType === "same-problem" && finalScore >= 50) {
    matchType = "same-problem";
  } else if (isEssentialStack && finalScore >= 35) {
    matchType = "tech-stack";
  } else if (finalScore >= 30) {
    matchType = "industry";
  } else {
    matchType = "keyword";
  }

  return {
    repo,
    relevanceScore: finalScore,
    matchReasons: reasons.length > 0 ? reasons : ["General compatibility"],
    matchType,
  };
}

/**
 * Determine which stack layers a repo belongs to
 */
function classifyRepoLayer(repo: OssRepository): string[] {
  const text = `${repo.id} ${repo.name} ${repo.description} ${repo.tags.join(" ")} ${repo.language}`.toLowerCase();

  // Specific repo ID overrides for perfect architecture grouping
  if (repo.id === "sharetribe-marketplace") return ["backend", "frontend"];
  if (repo.id === "medusa") return ["backend", "frontend"];
  if (repo.id === "supabase") return ["database", "backend", "auth"];
  if (repo.id === "hono") return ["backend"];
  if (repo.id === "supertokens-core") return ["auth"];
  if (repo.id === "lago-billing") return ["payments"];
  if (repo.id === "posthog-analytics") return ["analytics"];
  if (repo.id === "n8n-automation") return ["communication"];
  if (repo.id === "twenty-crm") return ["backend", "analytics"];
  if (repo.id === "cal.com") return ["backend", "communication"];

  const layers: string[] = [];
  for (const [layerKey, config] of Object.entries(STACK_LAYER_KEYWORDS)) {
    const matchCount = config.keywords.filter(kw => text.includes(kw)).length;
    if (matchCount >= 1) {
      layers.push(layerKey);
    }
  }

  return layers.length > 0 ? layers : ["backend"];
}

/**
 * Generate full tech stack recommendation for a startup
 */
export function generateTechStackRecommendation(
  startup: Startup,
  allRepos: OssRepository[]
): TechStackRecommendation {
  // Score all repos
  const scored = allRepos
    .map(repo => scoreRepoRelevance(startup, repo))
    .filter(m => m.relevanceScore >= 25)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Top overall matches
  const topRepos = scored.slice(0, 10);

  // Repos solving the same problem
  const sameProblemRepos = scored
    .filter(m => m.matchType === "same-problem" && m.relevanceScore >= 50)
    .slice(0, 4);

  // Organize by stack layer for "Build with OSS"
  const layerMap = new Map<string, RepoMatch[]>();
  for (const match of scored) {
    const layers = classifyRepoLayer(match.repo);
    for (const layer of layers) {
      if (!layerMap.has(layer)) layerMap.set(layer, []);
      const existing = layerMap.get(layer)!;
      if (existing.length < 4) {
        existing.push(match);
      }
    }
  }

  const buildWithRepos: StackLayer[] = [];
  for (const [layerKey, config] of Object.entries(STACK_LAYER_KEYWORDS)) {
    const repos = layerMap.get(layerKey) || [];
    if (repos.length > 0) {
      buildWithRepos.push({
        layer: layerKey as StackLayer["layer"],
        label: config.label,
        icon: config.icon,
        repos,
        description: `Recommended ${config.label.toLowerCase()} layer to build ${startup.name}`,
      });
    }
  }

  // Difficulty & build time estimation
  const avgScore = topRepos.reduce((sum, r) => sum + r.repo.qualityScore, 0) / (topRepos.length || 1);
  const difficultyLevel: TechStackRecommendation["difficultyLevel"] =
    avgScore > 90 ? "Beginner" :
    avgScore > 75 ? "Intermediate" :
    avgScore > 60 ? "Advanced" : "Expert";

  const layerCount = buildWithRepos.length;
  const estimatedBuildTime =
    layerCount <= 2 ? "1-2 Weeks" :
    layerCount <= 4 ? "2-4 Weeks" :
    layerCount <= 6 ? "1-2 Months" : "2-3 Months";

  return {
    startup,
    totalMatches: scored.length,
    topRepos,
    sameProblemRepos,
    buildWithRepos,
    searchQuery: buildGithubSearchQuery(startup),
    estimatedBuildTime,
    difficultyLevel,
  };
}

// ── Helpers & Word Lists ──

const EssentialStackRepos = new Set([
  "supabase",
  "hono",
  "supertokens-core",
  "infisical",
  "posthog-analytics",
  "lago-billing",
  "n8n-automation",
  "twenty-crm",
  "cal.com"
]);

// Generic meta-words that should not trigger domain matches on their own
const GENERIC_META_WORDS = new Set([
  "marketplace", "platform", "solution", "solutions", "service", "services",
  "system", "systems", "business", "businesses", "technology", "technologies",
  "product", "products", "build", "building", "helps", "helping", "allows",
  "enables", "connecting", "connects", "based", "founded", "read", "more",
  "using", "used", "make", "making", "way", "ways", "new", "one", "two",
  "also", "like", "get", "got", "first", "use", "world", "people", "need",
  "work", "working", "app", "application", "software", "tool", "tools",
  "management", "manager", "online", "mobile", "web", "cloud"
]);

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "her", "here", "hers", "him", "his", "how",
  "if", "in", "into", "is", "it", "its", "just", "me", "more", "most", "my", "no", "nor", "not",
  "of", "off", "on", "once", "only", "or", "other", "our", "out", "over", "own", "same", "she",
  "should", "so", "some", "such", "than", "that", "the", "their", "them", "then", "there", "these",
  "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we",
  "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you",
  "your", ...GENERIC_META_WORDS
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

// ── 3-Way Trifecta Matching Engine (YC ↔ GitHub ↔ Product Hunt) ──

/**
 * Score how relevant a Product Hunt Product is to a YC Startup
 */
function scorePhToYc(startup: Startup, ph: ProductHuntProduct): number {
  let score = 0;
  const sText = `${startup.name} ${startup.oneLiner} ${startup.longDescription} ${startup.industries.join(" ")} ${startup.tags.join(" ")}`.toLowerCase();
  const pText = `${ph.name} ${ph.tagline} ${ph.description} ${ph.category} ${ph.topics.join(" ")} ${ph.techStack.join(" ")}`.toLowerCase();

  // Name match or direct brand match
  if (startup.name.toLowerCase() === ph.name.toLowerCase()) return 100;
  if (sText.includes(ph.name.toLowerCase()) || pText.includes(startup.name.toLowerCase())) score += 50;

  // Domain & topic overlap
  const sKw = extractKeywords(sText);
  const pKw = extractKeywords(pText);
  let overlaps = 0;
  for (const [w] of sKw) {
    if (pKw.has(w)) overlaps++;
  }

  score += Math.min(40, overlaps * 6);

  // Hiring / Tech match bonus
  if (ph.votesCount > 1000) score += 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Score how relevant a Product Hunt Product is to a GitHub OSS Repo
 */
function scorePhToRepo(repo: OssRepository, ph: ProductHuntProduct): number {
  let score = 0;
  const rText = `${repo.name} ${repo.description} ${repo.tags.join(" ")} ${repo.language} ${repo.domainCategory}`.toLowerCase();
  const pText = `${ph.name} ${ph.tagline} ${ph.description} ${ph.category} ${ph.topics.join(" ")} ${ph.techStack.join(" ")}`.toLowerCase();

  // Same repo/product name
  if (repo.name.toLowerCase() === ph.name.toLowerCase()) return 100;

  // Tech stack overlap
  for (const tech of ph.techStack) {
    if (rText.includes(tech.toLowerCase())) score += 15;
  }

  // Domain keywords
  const rKw = extractKeywords(rText);
  const pKw = extractKeywords(pText);
  let overlaps = 0;
  for (const [w] of rKw) {
    if (pKw.has(w)) overlaps++;
  }
  score += Math.min(40, overlaps * 5);

  return Math.min(100, Math.max(0, score));
}

/**
 * Resolve 3-Way Ecosystem Context for any given item (YC Startup, GitHub Repo, or Product Hunt product)
 */
export function getThreeWayNodeContext({
  primaryType,
  ycStartup,
  githubRepo,
  productHuntProduct,
  allYc,
  allGithub,
  allPh,
}: {
  primaryType: "yc" | "github" | "producthunt";
  ycStartup?: Startup;
  githubRepo?: OssRepository;
  productHuntProduct?: ProductHuntProduct;
  allYc: Startup[];
  allGithub: OssRepository[];
  allPh: ProductHuntProduct[];
}): ThreeWayNodeContext {
  let matchedYc: Startup[] = [];
  let matchedGithub: OssRepository[] = [];
  let matchedProductHunt: ProductHuntProduct[] = [];

  if (primaryType === "yc" && ycStartup) {
    // Find matching GitHub Repos
    const repoMatches = allGithub
      .map((r) => ({ repo: r, score: scoreRepoRelevance(ycStartup, r).relevanceScore }))
      .filter((m) => m.score >= 30)
      .sort((a, b) => b.score - a.score);
    matchedGithub = repoMatches.map((m) => m.repo).slice(0, 5);

    // Find matching Product Hunt Products
    const phMatches = allPh
      .map((p) => ({ ph: p, score: scorePhToYc(ycStartup, p) }))
      .filter((m) => m.score >= 25)
      .sort((a, b) => b.score - a.score);
    matchedProductHunt = phMatches.map((m) => m.ph).slice(0, 5);
  } else if (primaryType === "github" && githubRepo) {
    // Find matching YC Startups
    const ycMatches = allYc
      .map((s) => ({ startup: s, score: scoreRepoRelevance(s, githubRepo).relevanceScore }))
      .filter((m) => m.score >= 30)
      .sort((a, b) => b.score - a.score);
    matchedYc = ycMatches.map((m) => m.startup).slice(0, 5);

    // Find matching Product Hunt Products
    const phMatches = allPh
      .map((p) => ({ ph: p, score: scorePhToRepo(githubRepo, p) }))
      .filter((m) => m.score >= 25)
      .sort((a, b) => b.score - a.score);
    matchedProductHunt = phMatches.map((m) => m.ph).slice(0, 5);
  } else if (primaryType === "producthunt" && productHuntProduct) {
    // Find matching YC Startups
    const ycMatches = allYc
      .map((s) => ({ startup: s, score: scorePhToYc(s, productHuntProduct) }))
      .filter((m) => m.score >= 25)
      .sort((a, b) => b.score - a.score);
    matchedYc = ycMatches.map((m) => m.startup).slice(0, 5);

    // Find matching GitHub Repos
    const repoMatches = allGithub
      .map((r) => ({ repo: r, score: scorePhToRepo(r, productHuntProduct) }))
      .filter((m) => m.score >= 25)
      .sort((a, b) => b.score - a.score);
    matchedGithub = repoMatches.map((m) => m.repo).slice(0, 5);
  }

  // Construct best trifecta match
  const bestYc = ycStartup || matchedYc[0] || allYc[0];
  const bestGithub = githubRepo || matchedGithub[0] || allGithub[0];
  const bestPh = productHuntProduct || matchedProductHunt[0] || allPh[0];

  const repoScore = scoreRepoRelevance(bestYc, bestGithub).relevanceScore;
  const phYcScore = scorePhToYc(bestYc, bestPh);
  const phRepoScore = scorePhToRepo(bestGithub, bestPh);
  const synergyScore = Math.round((repoScore + phYcScore + phRepoScore) / 3);

  const bestTrifectaPair: TrifectaMatch = {
    id: `trifecta-${bestYc.slug}-${bestGithub.id}-${bestPh.slug}`,
    ycStartup: bestYc,
    githubRepo: bestGithub,
    productHuntProduct: bestPh,
    synergyScore,
    synergyReasons: [
      `YC Validation (${bestYc.batch}): ${bestYc.oneLiner}`,
      `Codebase (${bestGithub.name}): ${bestGithub.stars.toLocaleString()} ⭐ - ${bestGithub.sarvamExplainer.whatItSolves}`,
      `GTM Traction (${bestPh.name}): ${bestPh.votesCount.toLocaleString()} ▲ Upvotes on Product Hunt`,
    ],
    builderPlaybook: {
      ycBusinessModel: `Validate market need like ${bestYc.name} (${bestYc.batch}). Target ${bestYc.industries.join(", ")} with monetizable value proposition.`,
      githubArchitecture: `Architect using ${bestGithub.name} (${bestGithub.language}) for core engine. Use ${bestGithub.sarvamExplainer.techStack.join(", ")} stack.`,
      productHuntLaunchGtm: `Craft Product Hunt pitch: "${bestPh.tagline}". Engage early maker community with transparent launch notes & live demos.`,
    },
  };

  return {
    primaryType,
    ycStartup,
    githubRepo,
    productHuntProduct,
    matchedYc,
    matchedGithub,
    matchedProductHunt,
    bestTrifectaPair,
  };
}

/**
 * Generate top Trifecta 3-Way Pairs across the entire database
 */
export function generateTrifectaMatches(
  allYc: Startup[],
  allGithub: OssRepository[],
  allPh: ProductHuntProduct[]
): TrifectaMatch[] {
  const trifectas: TrifectaMatch[] = [];

  for (const yc of allYc.slice(0, 15)) {
    const context = getThreeWayNodeContext({
      primaryType: "yc",
      ycStartup: yc,
      allYc,
      allGithub,
      allPh,
    });
    if (context.bestTrifectaPair) {
      trifectas.push(context.bestTrifectaPair);
    }
  }

  return trifectas.sort((a, b) => b.synergyScore - a.synergyScore);
}

// ── Startup + GitHub Connection Relationship Engine ──

const KNOWN_OFFICIAL_REPOS: Record<string, string[]> = {
  "supabase": ["supabase/supabase", "supabase/realtime", "supabase/gotrue", "supabase/postgrest-js"],
  "posthog": ["PostHog/posthog", "PostHog/posthog-js", "posthog-analytics"],
  "cal-com": ["calcom/cal.com"],
  "medusa": ["medusajs/medusa"],
  "lago": ["getlago/lago"],
  "twenty": ["twentyhq/twenty"],
  "sharetribe": ["sharetribe/sharetribe", "sharetribe-marketplace"],
  "orthanc": ["orthanc-server"],
  "vanna": ["vanna-ai/vanna"],
  "crewai": ["crewAIInc/crewAI", "crewAI"],
  "n8n": ["n8n-io/n8n", "n8n-automation"]
};

/**
 * Detect whether a repository is officially created/maintained by a startup or algorithmically inferred
 */
export function detectRepositoryRelationship(
  startup: Startup,
  repo: OssRepository
): { isOfficial: boolean; relationshipType: EcosystemRelationshipType; verificationDetails: string } {
  const sSlug = startup.slug.toLowerCase();
  const sNameClean = startup.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const repoOwner = repo.owner.toLowerCase();
  const repoName = repo.name.toLowerCase();
  const repoFullName = repo.fullName.toLowerCase();

  // 1. Check known verified map
  if (KNOWN_OFFICIAL_REPOS[sSlug]) {
    const matched = KNOWN_OFFICIAL_REPOS[sSlug].some(
      r => repo.id === r || repoFullName === r.toLowerCase() || repoName === r.toLowerCase()
    );
    if (matched) {
      return {
        isOfficial: true,
        relationshipType: "officially_associated",
        verificationDetails: `Verified First-Party Repository maintained directly by ${startup.name} organization (${repo.owner}).`
      };
    }
  }

  // 2. Direct owner/name match
  if (repoOwner === sSlug || repoOwner === sNameClean || repoName === sSlug || repoName === sNameClean) {
    return {
      isOfficial: true,
      relationshipType: "officially_associated",
      verificationDetails: `Official GitHub Organization match: '${repo.owner}' matches ${startup.name}.`
    };
  }

  // 3. Website domain matching repository owner
  if (startup.website) {
    const domainMatch = startup.website.toLowerCase().replace(/https?:\/\/(www\.)?/, "").split("/")[0].split(".")[0];
    if (domainMatch && domainMatch.length > 3 && repoOwner === domainMatch) {
      return {
        isOfficial: true,
        relationshipType: "officially_associated",
        verificationDetails: `Official Domain match: Website '${startup.website}' correlates with GitHub account '${repo.owner}'.`
      };
    }
  }

  // Default: Inferred / Possibly Related
  return {
    isOfficial: false,
    relationshipType: "possibly_related",
    verificationDetails: `Algorithmically Matched: Open source project sharing domain problem space and tech stack components with ${startup.name}.`
  };
}

/**
 * Generate full Business + Technology Ecosystem Connection Summary for a Startup
 */
export function generateCompanyEcosystemSummary(
  startup: Startup,
  allRepos: OssRepository[]
): CompanyEcosystemSummary {
  // 1. Get raw tech stack recommendation matches
  const rec = generateTechStackRecommendation(startup, allRepos);

  const officialRepos: RepoMatch[] = [];
  const possiblyRelatedRepos: RepoMatch[] = [];
  const techMap = new Map<string, { category: TechStackItem["category"]; repos: OssRepository[] }>();

  // Process top & same problem matches
  const processedSeen = new Set<string>();

  for (const match of [...rec.topRepos, ...rec.sameProblemRepos]) {
    if (processedSeen.has(match.repo.id)) continue;
    processedSeen.add(match.repo.id);

    const rel = detectRepositoryRelationship(startup, match.repo);
    const enrichedMatch: RepoMatch = {
      ...match,
      relationshipType: rel.relationshipType,
      officialVerificationDetails: rel.verificationDetails,
      techTags: [match.repo.language, ...(match.repo.tags || []), ...(match.repo.sarvamExplainer?.techStack || [])]
    };

    if (rel.isOfficial) {
      officialRepos.push(enrichedMatch);
    } else {
      possiblyRelatedRepos.push(enrichedMatch);
    }

    // Register technologies
    const lang = match.repo.language;
    if (lang) {
      if (!techMap.has(lang)) techMap.set(lang, { category: "Language", repos: [] });
      techMap.get(lang)!.repos.push(match.repo);
    }

    if (match.repo.sarvamExplainer?.techStack) {
      for (const tech of match.repo.sarvamExplainer.techStack) {
        if (!techMap.has(tech)) {
          let category: TechStackItem["category"] = "Framework";
          const lower = tech.toLowerCase();
          if (lower.includes("db") || lower.includes("sql") || lower.includes("postgres") || lower.includes("mongo") || lower.includes("redis")) {
            category = "Database";
          } else if (lower.includes("docker") || lower.includes("kubernetes") || lower.includes("aws") || lower.includes("gcp") || lower.includes("deploy")) {
            category = "Infrastructure";
          } else if (lower.includes("python") || lower.includes("typescript") || lower.includes("rust") || lower.includes("go") || lower.includes("c++")) {
            category = "Language";
          }
          techMap.set(tech, { category, repos: [] });
        }
        if (!techMap.get(tech)!.repos.some(r => r.id === match.repo.id)) {
          techMap.get(tech)!.repos.push(match.repo);
        }
      }
    }
  }

  // Sort tech stack by repo count
  const techStackBreakdown: TechStackItem[] = Array.from(techMap.entries())
    .map(([name, data]) => ({
      name,
      category: data.category,
      count: data.repos.length,
      repos: data.repos
    }))
    .sort((a, b) => b.count - a.count);

  // Build Visual Tree Nodes
  const treeNodes: EcosystemTreeNode[] = [
    {
      id: "node-root",
      label: `${startup.name} (${startup.batch || 'YC Company'})`,
      type: "company",
      badgeText: startup.status,
      children: [
        {
          id: "node-industry",
          label: `Industry & Sector: ${startup.industries.join(", ") || 'Developer Tools'}`,
          type: "industry",
        },
        {
          id: "node-products",
          label: `Business Value Proposition: "${startup.oneLiner}"`,
          type: "products",
        },
        {
          id: "node-repos-header",
          label: `Related Open Source Repositories (${officialRepos.length} Official | ${possiblyRelatedRepos.length} Inferred)`,
          type: "repos_header",
          children: [
            ...officialRepos.map(r => ({
              id: `tree-off-${r.repo.id}`,
              label: `├── ${r.repo.fullName} [${r.repo.language}]`,
              type: "official_repo" as const,
              relationship: "officially_associated" as const,
              badgeText: "VERIFIED OFFICIAL",
              metadata: {
                language: r.repo.language,
                stars: r.repo.stars,
                url: r.repo.repoUrl,
                description: r.repo.description,
                repoId: r.repo.id,
              }
            })),
            ...possiblyRelatedRepos.slice(0, 7).map((r, i, arr) => ({
              id: `tree-rel-${r.repo.id}`,
              label: `${i === arr.length - 1 ? '└──' : '├──'} ${r.repo.fullName} [${r.repo.language}]`,
              type: "related_repo" as const,
              relationship: "possibly_related" as const,
              badgeText: "INFERRED / RELATED",
              metadata: {
                language: r.repo.language,
                stars: r.repo.stars,
                url: r.repo.repoUrl,
                description: r.repo.description,
                repoId: r.repo.id,
              }
            }))
          ]
        },
        {
          id: "node-tech-header",
          label: `Technology & Stack Footprint (${techStackBreakdown.length} Technologies Identified)`,
          type: "tech_stack_header",
          children: techStackBreakdown.slice(0, 10).map((t, i, arr) => ({
            id: `tree-tech-${t.name}`,
            label: `${i === arr.length - 1 ? '└──' : '├──'} ${t.name} (${t.category}) — Referenced in ${t.count} open source component(s)`,
            type: "tech_item" as const
          }))
        }
      ]
    }
  ];

  return {
    startup,
    officialRepos,
    possiblyRelatedRepos,
    techStackBreakdown,
    treeNodes,
    totalOfficialCount: officialRepos.length,
    totalRelatedCount: possiblyRelatedRepos.length,
  };
}


