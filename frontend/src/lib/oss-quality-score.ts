import { OssRepository } from "@/modules/githuboss/types";

/**
 * Calculates the Underrated Quality Score (0 - 100)
 * Uses a mathematical formula weighing commit activity, issue resolution ratio, 
 * maintainer health, and star growth velocity.
 */
export function calculateQualityScore(repo: {
  stars: number;
  openIssues: number;
  closedIssues: number;
  lastCommitDate: string;
  monthlyCommitVelocity: number;
  starGrowthRate: number;
}): { score: number; isUnderrated: boolean; healthLabel: "Excellent" | "Good" | "Needs Attention" | "Inactive" } {
  const now = new Date().getTime();
  const commitTime = new Date(repo.lastCommitDate).getTime();
  const daysSinceCommit = Math.max(0, (now - commitTime) / (1000 * 60 * 60 * 24));

  // 1. Recency Decay Score (Exponential decay based on days since last commit)
  const recencyScore = Math.max(0, 100 * Math.exp(-daysSinceCommit / 60)); // 60 days half-life

  // 2. Issue Resolution Ratio
  const totalIssues = repo.openIssues + repo.closedIssues;
  const issueResolutionRatio = totalIssues > 0 ? repo.closedIssues / totalIssues : 0.85;
  const issueScore = Math.min(100, issueResolutionRatio * 100);

  // 3. Velocity Score (Commits per month)
  const velocityScore = Math.min(100, repo.monthlyCommitVelocity * 4);

  // 4. Growth Trajectory Score
  const growthScore = Math.min(100, repo.starGrowthRate * 2.5);

  // Composite Weighted Score Formula
  const finalScore = Math.round(
    recencyScore * 0.35 +
    issueScore * 0.25 +
    velocityScore * 0.25 +
    growthScore * 0.15
  );

  const boundedScore = Math.min(99, Math.max(12, finalScore));

  // Health label determination
  let healthLabel: "Excellent" | "Good" | "Needs Attention" | "Inactive" = "Inactive";
  if (daysSinceCommit < 14 && boundedScore >= 75) {
    healthLabel = "Excellent";
  } else if (daysSinceCommit < 45 && boundedScore >= 60) {
    healthLabel = "Good";
  } else if (daysSinceCommit < 120) {
    healthLabel = "Needs Attention";
  }

  // Underrated check: Solid score (>70) but lower star count (<2000)
  const isUnderrated = repo.stars < 2000 && boundedScore >= 70;

  return {
    score: boundedScore,
    isUnderrated,
    healthLabel,
  };
}

/**
 * Returns color tokens for quality score badges
 */
export function getScoreBadgeStyle(score: number): { bg: string; text: string; border: string } {
  if (score >= 80) {
    return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
  } else if (score >= 65) {
    return { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" };
  } else if (score >= 50) {
    return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" };
  } else {
    return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" };
  }
}
