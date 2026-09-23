import { OssRepository, DomainCategory, LaunchRadarItem } from "@/modules/githuboss/types";
import { SAMPLE_OSS_REPOSITORIES, SAMPLE_LAUNCH_RADAR_ITEMS } from "@/data/githuboss-repos";
import { getScoreBadgeStyle, calculateQualityScore } from "@/lib/oss-quality-score";

import { GithubApiService } from "./github-api.service";

export interface RepositoryFilterOptions {
  domain?: DomainCategory | "All";
  language?: string;
  starRange?: string;
  sortBy?: "stars" | "forks" | "updated" | "relevance";
  license?: string;
  onlyUnderrated?: boolean;
  onlyAwesome?: boolean;
  query?: string;
  page?: number;
  perPage?: number;
}

/**
 * Service for GitHub Open Source repository operations,
 * live REST API search, launch radar signals, and quality metrics.
 */
export class GithubService {
  /**
   * Fetches real live repositories directly from GitHub REST API with fallback
   */
  public static async fetchLiveRepositories(options?: RepositoryFilterOptions): Promise<{ repos: OssRepository[]; isLive: boolean; totalCount?: number; hasMore?: boolean; error?: string }> {
    return GithubApiService.fetchLiveRepositories(options || {});
  }

  /**
   * Retrieves GitHub API Personal Access Token
   */
  public static getGithubToken(): string | null {
    return GithubApiService.getGithubToken();
  }

  /**
   * Saves GitHub Token
   */
  public static setGithubToken(token: string): void {
    GithubApiService.setGithubToken(token);
  }

  /**
   * Synchronous fallback getter for cached repositories
   */
  public static getRepositories(options?: RepositoryFilterOptions): OssRepository[] {
    const repos = [...SAMPLE_OSS_REPOSITORIES];

    if (!options) return repos;

    const { domain = "All", onlyUnderrated = false, query = "" } = options;

    return repos.filter((repo) => {
      // Domain filter
      if (domain !== "All" && repo.domainCategory !== domain) {
        return false;
      }

      // Underrated filter (<2k stars)
      if (onlyUnderrated && !repo.isUnderrated) {
        return false;
      }

      // Plain language search filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(q) || repo.fullName.toLowerCase().includes(q);
        const matchesDesc = repo.description.toLowerCase().includes(q);
        const matchesTags = repo.tags.some((t) => t.toLowerCase().includes(q));
        const matchesUseCases = repo.communityUseCases.some((uc) => uc.toLowerCase().includes(q));
        const matchesSarvam = repo.sarvamExplainer.whatItSolves.toLowerCase().includes(q) ||
                              repo.sarvamExplainer.whyRelevantToSearch.toLowerCase().includes(q);

        return matchesName || matchesDesc || matchesTags || matchesUseCases || matchesSarvam;
      }

      return true;
    });
  }

  /**
   * Retrieves early-mover GitHub Launch Radar items
   */
  public static getLaunchRadarItems(): LaunchRadarItem[] {
    return SAMPLE_LAUNCH_RADAR_ITEMS;
  }

  /**
   * Gets quality score badge style & metadata
   */
  public static getScoreBadgeStyle(score: number) {
    return getScoreBadgeStyle(score);
  }

  /**
   * Calculates quality score for a repository
   */
  public static calculateQualityScore(repoStats: {
    stars: number;
    openIssues: number;
    closedIssues: number;
    lastCommitDate: string;
    monthlyCommitVelocity: number;
    starGrowthRate: number;
  }) {
    return calculateQualityScore(repoStats);
  }
}
