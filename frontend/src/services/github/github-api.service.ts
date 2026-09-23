import { OssRepository, DomainCategory } from "@/modules/githuboss/types";
import { calculateQualityScore } from "@/lib/oss-quality-score";
import { SAMPLE_OSS_REPOSITORIES } from "@/data/githuboss-repos";

const GITHUB_SEARCH_API = "https://api.github.com/search/repositories";

export class GithubApiService {
  /**
   * Retrieves GitHub API Personal Access Token if configured
   */
  public static getGithubToken(): string | null {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("GITHUB_TOKEN")?.trim();
      if (localToken && localToken.length > 5) return localToken;
    }
    const envToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
    if (envToken && envToken.length > 5 && !envToken.includes("your_github_token")) {
      return envToken;
    }
    // Direct fallback to user configured token in .env.local
    return "";
  }

  /**
   * Saves custom GitHub Token to localStorage
   */
  public static setGithubToken(token: string): void {
    if (typeof window !== "undefined") {
      if (token.trim()) {
        localStorage.setItem("GITHUB_TOKEN", token.trim());
      } else {
        localStorage.removeItem("GITHUB_TOKEN");
      }
    }
  }

  /**
   * Fetches real live repositories directly from GitHub REST API
   */
  public static async fetchLiveRepositories(options: {
    query?: string;
    domain?: DomainCategory | "All";
    subCategoryQuery?: string;
    discoveryMode?: "all" | "trending" | "gems" | "emerging" | "top";
    language?: string;
    starRange?: string;
    sortBy?: "stars" | "forks" | "updated" | "relevance";
    license?: string;
    onlyUnderrated?: boolean;
    onlyAwesome?: boolean;
    page?: number;
    perPage?: number;
  }): Promise<{ repos: OssRepository[]; isLive: boolean; totalCount?: number; hasMore?: boolean; error?: string }> {
    const {
      query = "",
      domain = "All",
      subCategoryQuery = "",
      discoveryMode = "all",
      language = "All",
      starRange = "All",
      sortBy = "stars",
      license = "All",
      onlyUnderrated = false,
      onlyAwesome = false,
      page = 1,
      perPage = 60,
    } = options;

    // Build GitHub API Query String
    let searchTerms = query.trim() ? query.trim() : "";

    if (subCategoryQuery.trim()) {
      searchTerms = searchTerms ? `${searchTerms} ${subCategoryQuery.trim()}` : subCategoryQuery.trim();
    }

    if (onlyAwesome) {
      searchTerms += " topic:awesome OR topic:awesome-list OR awesome";
    }

    if (domain !== "All" && !subCategoryQuery) {
      const domainKeywords: Record<string, string> = {
        "Fintech": "fintech OR trading OR stock-market OR finance OR algorithmic-trading",
        "AI & Machine Learning": "ai OR llm OR machine-learning OR rag OR deep-learning",
        "DevTools & Infrastructure": "devtools OR serverless OR database OR framework OR infrastructure",
        "Healthtech & Bio": "healthtech OR bioinformatics OR medical OR healthcare OR bio",
        "E-Commerce & Retail": "ecommerce OR shopify OR storefront OR shopping OR e-commerce",
        "Security & Privacy": "security OR authentication OR encryption OR privacy OR cybersecurity",
        "Entertainment & Media": "streaming OR music OR video OR media OR audio OR player",
        "Gaming & Graphics": "gamedev OR graphics OR 3d OR rendering OR opengl OR vulkan",
        "Data & Analytics": "data-analytics OR visualization OR etl OR big-data OR dataframe",
        "Productivity & SaaS": "productivity OR saas OR workflow OR automation OR notes",
        "Web3 & Crypto": "web3 OR blockchain OR ethereum OR solana OR crypto",
        "Frameworks & Libraries": "topic:framework OR framework",
        "Programming Languages": "language",
        "Backend Architecture": "backend OR api OR microservices OR serverless",
        "Frontend & UI UX": "frontend OR ui-library OR design-system",
        "DevOps & Infrastructure": "kubernetes OR docker OR devops OR iac",
        "Security & Cyber": "security OR vulnerability-scanner OR cybersecurity",
        "Databases & Storage": "database OR vector-database OR postgresql OR redis",
        "Data Science & ETL": "data-science OR etl OR pandas OR airflow",
        "Robotics & Autonomous": "robotics OR ros2 OR autonomous-vehicles"
      };
      if (domainKeywords[domain]) {
        searchTerms = searchTerms ? `${searchTerms} ${domainKeywords[domain]}` : domainKeywords[domain];
      }
    }

    if (language && language !== "All") {
      const langQuery = language.toLowerCase() === "c++ font" ? "cpp" : language.toLowerCase();
      searchTerms += ` language:${langQuery}`;
    }

    if (license && license !== "All") {
      searchTerms += ` license:${license.toLowerCase()}`;
    }

    // Discovery Modes & Star Range logic
    let effectiveSort = sortBy;

    if (discoveryMode === "trending") {
      effectiveSort = "updated";
      if (starRange === "All") {
        searchTerms += " stars:50..50000";
      }
    } else if (discoveryMode === "gems") {
      if (starRange === "All") searchTerms += " stars:100..3000";
    } else if (discoveryMode === "emerging") {
      if (starRange === "All") searchTerms += " stars:3000..20000";
    } else if (discoveryMode === "top") {
      if (starRange === "All") searchTerms += " stars:>20000";
    }

    if (starRange && starRange !== "All") {
      switch (starRange) {
        case "100k+":
          searchTerms += " stars:>100000";
          break;
        case "20k-100k":
          searchTerms += " stars:20000..100000";
          break;
        case "5k-20k":
          searchTerms += " stars:5000..20000";
          break;
        case "1k-5k":
          searchTerms += " stars:1000..5000";
          break;
        case "<1k":
          searchTerms += " stars:<1000";
          break;
      }
    } else if (onlyUnderrated && discoveryMode === "all") {
      searchTerms += " stars:50..2000";
    }

    if (!searchTerms.trim()) {
      searchTerms = "stars:>100";
    }

    const token = this.getGithubToken();
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      let sortParam = "stars";
      const orderParam = "desc";
      if (effectiveSort === "forks") sortParam = "forks";
      else if (effectiveSort === "updated") sortParam = "updated";
      else if (effectiveSort === "relevance") sortParam = "";

      const sortQuery = sortParam ? `&sort=${sortParam}&order=${orderParam}` : "";
      console.log(`[GitHub API] Fetching live data (Page ${page}, perPage ${perPage}) for query: "${searchTerms}"`);
      const url = `${GITHUB_SEARCH_API}?q=${encodeURIComponent(searchTerms)}${sortQuery}&page=${page}&per_page=${perPage}`;
      
      const response = await fetch(url, { headers });

      if (response.ok) {
        const data = await response.json();
        const totalCount = data.total_count || 0;
        console.log(`[GitHub API] Live Success: Received ${data.items?.length || 0} items of ${totalCount} total`);

        if (Array.isArray(data.items) && data.items.length > 0) {
          const mappedRepos: OssRepository[] = data.items.map((item: any) => this.mapGithubItemToRepo(item, domain));
          const hasMore = page * perPage < Math.min(totalCount, 1000);
          return { repos: mappedRepos, isLive: true, totalCount, hasMore };
        }
      } else {
        const errText = await response.text();
        console.warn(`[GitHub API] Rate limit or API error (${response.status}):`, errText);
        if (response.status === 403 || response.status === 429) {
          return { 
            repos: this.filterFallbackRepos(options), 
            isLive: false, 
            error: "GitHub API rate limit reached. Add a free GitHub Token for higher limits (5,000 req/hr)." 
          };
        }
      }
    } catch (err) {
      console.error("[GitHub API] Network failure during fetch:", err);
    }

    // Smooth fallback to local curated dataset if offline or rate-limited
    return { repos: this.filterFallbackRepos(options), isLive: false };
  }

  /**
   * Maps raw GitHub REST API repository object to application OssRepository format
   */
  private static mapGithubItemToRepo(item: any, selectedDomain: DomainCategory | "All"): OssRepository {
    const stars = item.stargazers_count || 0;
    const openIssues = item.open_issues_count || 0;
    const closedIssues = Math.round(openIssues * 4.2);
    const lastCommitDate = item.pushed_at || item.updated_at || new Date().toISOString();
    const monthlyVelocity = Math.max(8, Math.min(120, Math.round(stars / 400 + openIssues / 5)));
    const starGrowthRate = Math.max(5, Math.round(stars / 150));

    // Dynamic Quality Score Calculation
    const qualityResult = calculateQualityScore({
      stars,
      openIssues,
      closedIssues,
      lastCommitDate,
      monthlyCommitVelocity: monthlyVelocity,
      starGrowthRate,
    });

    const primaryLanguage = item.language || "TypeScript";
    const topics: string[] = item.topics || [];
    const fullText = (item.name + " " + item.full_name + " " + (item.description || "") + " " + topics.join(" ")).toLowerCase();

    // Domain Fingerprint Keyword Map
    const DOMAIN_KEYWORDS: Record<DomainCategory, string[]> = {
      "Fintech": ["fintech", "trading", "stock", "finance", "algorithmic-trading", "options", "portfolio", "investing", "payment", "crypto", "ledger", "billing", "bank", "exchange", "bloomberg", "yfinance", "ccxt", "ticker", "stripe"],
      "AI & Machine Learning": ["ai", "llm", "machine-learning", "rag", "deep-learning", "gpt", "transformer", "nlp", "vector", "embedding", "neural", "diffusion", "model", "ollama", "langchain", "crewai", "vanna", "pytorch", "tensorflow"],
      "DevTools & Infrastructure": ["devtools", "serverless", "database", "framework", "infrastructure", "docker", "kubernetes", "orm", "prisma", "drizzle", "hono", "supabase", "express", "backend", "ci-cd", "compiler", "api-gateway"],
      "Healthtech & Bio": ["healthtech", "bioinformatics", "medical", "healthcare", "bio", "dicom", "clinical", "hospital", "patient", "dna", "crispr", "genomics", "biopython", "monai", "pacs"],
      "E-Commerce & Retail": ["ecommerce", "shopify", "storefront", "shopping", "e-commerce", "cart", "checkout", "medusa", "payload", "stripe", "merchant", "inventory", "d2c"],
      "Security & Privacy": ["security", "authentication", "encryption", "privacy", "cybersecurity", "auth", "oauth", "supertokens", "keycloak", "vault", "identity", "jwt", "passkey"],
      "Entertainment & Media": ["streaming", "music", "video", "media", "audio", "player", "ffmpeg", "mp4", "webrtc", "podcast", "spotify"],
      "Gaming & Graphics": ["gamedev", "graphics", "3d", "rendering", "opengl", "vulkan", "unity", "godot", "unreal", "shader", "webgl", "canvas"],
      "Data & Analytics": ["data-analytics", "visualization", "etl", "big-data", "dataframe", "pandas", "spark", "clickhouse", "duckdb", "grafana", "dashboard", "dbt", "posthog"],
      "Productivity & SaaS": ["productivity", "saas", "workflow", "automation", "notes", "calendar", "cal.com", "n8n", "crm", "twenty", "notion", "linear", "task", "management"],
      "Web3 & Crypto": ["web3", "blockchain", "ethereum", "solana", "crypto", "solidity", "smart-contract", "nft", "defi", "bitcoin", "wallet", "ethers"],
      "Frameworks & Libraries": ["framework", "react", "vue", "svelte", "nextjs", "fastapi", "django", "express", "pytorch", "tensorflow", "library"],
      "Programming Languages": ["python", "typescript", "javascript", "rust", "go", "golang", "cpp", "c++", "java", "swift", "kotlin", "php"],
      "Backend Architecture": ["backend", "api", "microservices", "grpc", "orm", "prisma", "auth", "oauth", "jwt", "queue", "rabbitmq", "kafka", "serverless"],
      "Frontend & UI UX": ["frontend", "ui", "components", "design-system", "tailwind", "radix", "shadcn", "state-management", "threejs", "canvas", "webgl"],
      "DevOps & Infrastructure": ["kubernetes", "k8s", "docker", "argocd", "helm", "terraform", "opentofu", "prometheus", "grafana", "opentelemetry", "ci-cd"],
      "Security & Cyber": ["security", "vulnerability", "scanner", "pentesting", "sast", "cryptography", "vault", "encryption", "cybersecurity"],
      "Databases & Storage": ["database", "vector-database", "vector", "qdrant", "chroma", "weaviate", "postgresql", "mysql", "mongodb", "redis", "clickhouse", "duckdb"],
      "Data Science & ETL": ["data-science", "etl", "airflow", "dagster", "dbt", "spark", "polars", "pandas", "jupyter", "arrow", "pipeline"],
      "Robotics & Autonomous": ["robotics", "ros", "ros2", "autonomous", "drone", "slam", "ardupilot", "px4", "embedded", "hardware"]
    };

    // Calculate domain category and keyword match count
    let domainCategory: DomainCategory = selectedDomain !== "All" ? selectedDomain : "DevTools & Infrastructure";
    let matchCount = 0;

    if (selectedDomain !== "All") {
      const kwList = DOMAIN_KEYWORDS[selectedDomain] || [];
      matchCount = kwList.reduce((acc, kw) => acc + (fullText.includes(kw) ? 1 : 0), 0);
    } else {
      // Find domain with maximum keyword matches
      let bestDomain: DomainCategory = "DevTools & Infrastructure";
      let maxMatches = 0;

      (Object.keys(DOMAIN_KEYWORDS) as DomainCategory[]).forEach((cat) => {
        const matches = DOMAIN_KEYWORDS[cat].reduce((acc, kw) => acc + (fullText.includes(kw) ? 1 : 0), 0);
        if (matches > maxMatches) {
          maxMatches = matches;
          bestDomain = cat;
        }
      });

      domainCategory = bestDomain;
      matchCount = maxMatches;
    }

    // Determine Relevance Badge & Score
    let relevanceScore = 90;
    let relevanceMatchBadge = "⚡ Related Solution";
    if (matchCount >= 3) {
      relevanceScore = 98;
      relevanceMatchBadge = `🎯 Direct ${domainCategory} Fit`;
    } else if (matchCount >= 1) {
      relevanceScore = 92;
      relevanceMatchBadge = `⚡ Verified ${domainCategory} Tooling`;
    } else {
      relevanceScore = 82;
      relevanceMatchBadge = `🧩 Stack Component`;
    }

    const desc = item.description || `High-performance ${primaryLanguage} open-source repository for ${domainCategory}.`;

    return {
      id: `gh-${item.id}`,
      name: item.name,
      fullName: item.full_name,
      owner: item.owner?.login || "github",
      avatarUrl: item.owner?.avatar_url || "https://github.githubassets.com/favicons/favicon.png",
      repoUrl: item.html_url,
      description: desc,
      stars,
      forks: item.forks_count || 0,
      openIssues,
      closedIssues,
      lastCommitDate,
      createdDate: item.created_at || "2022-01-01T00:00:00Z",
      license: item.license?.spdx_id || item.license?.name || "MIT",
      language: primaryLanguage,
      domainCategory,
      tags: topics.length > 0 ? topics.slice(0, 6) : [primaryLanguage.toLowerCase(), "open-source", domainCategory.toLowerCase()],
      communityUseCases: [
        `Integrated ${item.name} into production ${domainCategory} architecture`,
        `Automated core business workflow using ${primaryLanguage}`,
        `Scaled infrastructure with ${stars.toLocaleString()} star repository`
      ],
      qualityScore: qualityResult.score,
      isUnderrated: qualityResult.isUnderrated,
      maintainerHealth: qualityResult.healthLabel,
      monthlyCommitVelocity: monthlyVelocity,
      starGrowthRate,
      relevanceMatchBadge,
      relevanceScore,
      sarvamExplainer: {
        whatItSolves: `${desc} Provides modular ${primaryLanguage} primitives and active maintainer updates.`,
        techStack: [primaryLanguage, ...topics.slice(0, 3)],
        maturity: stars > 10000 ? "Battle-Tested" : stars > 2000 ? "Production Viable" : "Emerging",
        whyRelevantToSearch: `Live GitHub result matched against ${domainCategory} domain query with ${stars.toLocaleString()} stargazers.`,
        pros: ["100% verified GitHub repository", `Backed by ${stars.toLocaleString()} GitHub stargazers`, "Free open-source license"],
        cons: ["Inspect open issues before deploying to core production pipelines"],
        recommendedUseCases: [
          `Production ${domainCategory} infrastructure`,
          `Developer automation tooling`,
          `Custom startup MVP foundation`
        ]
      },
      mvpPathway: {
        saasIdeaTitle: `AI Powered ${item.name} SaaS Platform`,
        problemSolved: `Automates ${desc.slice(0, 80)}... into a user-friendly SaaS dashboard for non-technical users.`,
        architectureBlueprint: [
          `1. Connect ${item.name} core backend API`,
          `2. Authenticate users via Next.js Auth`,
          `3. Trigger Sarvam AI for automatic telemetry & report generation`,
          `4. Deliver automated user alerts`
        ],
        estimatedBuildTime: "3 to 5 Days",
        monetizationModel: "Subscription ($29/month per active seat)",
        missingComponentsToBuild: ["Next.js Dashboard UI", "Stripe Checkout Integration"]
      },
      integrationGuide: {
        installCommand: primaryLanguage.toLowerCase() === "python" ? `pip install ${item.name}` : `npm install ${item.name}`,
        configSteps: [
          `Clone repository: git clone ${item.html_url}.git`,
          `Install dependencies using ${primaryLanguage} package manager`,
          `Configure environment parameters in .env file`
        ],
        minimalSnippet: {
          title: `quickstart.${primaryLanguage.toLowerCase() === "python" ? "py" : "ts"}`,
          language: primaryLanguage.toLowerCase(),
          code: `# Live GitHub Repository Setup: ${item.full_name}\n# GitHub Stars: ${stars.toLocaleString()}\n# License: ${item.license?.spdx_id || "MIT"}\n\n// Import & initialize ${item.name}\nconsole.log("Loaded ${item.full_name} from live GitHub REST API!");`
        }
      },
      readmeMarkdown: `# ${item.full_name}\n\n${desc}\n\n[View Repository on GitHub](${item.html_url})`
    };
  }

  /**
   * Filters local fallback curated dataset if offline or rate-limited
   */
  private static filterFallbackRepos(options: {
    query?: string;
    domain?: DomainCategory | "All";
    language?: string;
    starRange?: string;
    sortBy?: "stars" | "forks" | "updated" | "relevance";
    license?: string;
    onlyUnderrated?: boolean;
    onlyAwesome?: boolean;
  }): OssRepository[] {
    const {
      domain = "All",
      language = "All",
      starRange = "All",
      sortBy = "stars",
      license = "All",
      onlyUnderrated = false,
      onlyAwesome = false,
      query = "",
    } = options;

    let filtered = SAMPLE_OSS_REPOSITORIES.filter((repo) => {
      if (domain !== "All" && repo.domainCategory !== domain) return false;

      if (onlyAwesome) {
        const fullText = (repo.name + " " + repo.description + " " + repo.tags.join(" ")).toLowerCase();
        if (!fullText.includes("awesome")) return false;
      }

      if (language !== "All") {
        const repoLang = (repo.language || "").toLowerCase();
        const targetLang = language.toLowerCase();
        if (targetLang === "c++ font" || targetLang === "c++") {
          if (!repoLang.includes("c++") && !repoLang.includes("cpp")) return false;
        } else if (!repoLang.includes(targetLang)) {
          return false;
        }
      }

      if (license !== "All") {
        const repoLic = (repo.license || "").toLowerCase();
        const targetLic = license.toLowerCase();
        if (!repoLic.includes(targetLic)) return false;
      }

      if (starRange !== "All") {
        const s = repo.stars;
        if (starRange === "100k+" && s < 100000) return false;
        if (starRange === "20k-100k" && (s < 20000 || s > 100000)) return false;
        if (starRange === "5k-20k" && (s < 5000 || s > 20000)) return false;
        if (starRange === "1k-5k" && (s < 1000 || s > 5000)) return false;
        if (starRange === "<1k" && s >= 1000) return false;
      } else if (onlyUnderrated && !repo.isUnderrated) {
        return false;
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          repo.name.toLowerCase().includes(q) ||
          repo.fullName.toLowerCase().includes(q) ||
          repo.description.toLowerCase().includes(q) ||
          repo.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    // Sorting
    if (sortBy === "forks") {
      filtered = filtered.sort((a, b) => b.forks - a.forks);
    } else if (sortBy === "updated") {
      filtered = filtered.sort((a, b) => new Date(b.lastCommitDate).getTime() - new Date(a.lastCommitDate).getTime());
    } else if (sortBy === "relevance") {
      filtered = filtered.sort((a, b) => b.qualityScore - a.qualityScore);
    } else {
      // Default stars
      filtered = filtered.sort((a, b) => b.stars - a.stars);
    }

    return filtered;
  }
}
