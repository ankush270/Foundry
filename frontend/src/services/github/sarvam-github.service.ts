import { OssRepository, QaMessage, SarvamExplainerPayload, MvpPathway, CodeSnippet } from "@/modules/githuboss/types";

const SARVAM_API_ENDPOINT = "https://api.sarvam.ai/v1/chat/completions";

/**
 * Sarvam AI GitHub Service Handler
 * Integrates Sarvam LLM for semantic search matching, plain language repo explanations,
 * doc Q&A playground responses, and founder MVP pathway generation for GitHub Repos.
 */
export class SarvamGithubService {
  private static getApiKey(): string | null {
    if (typeof window !== "undefined") {
      const localKey = localStorage.getItem("SARVAM_API_KEY")?.trim();
      if (localKey && localKey.length > 5) return localKey;
    }
    const envKey = process.env.NEXT_PUBLIC_SARVAM_API_KEY?.trim() || process.env.SARVAM_API_KEY?.trim();
    if (envKey && envKey.length > 5 && !envKey.includes("your_sarvam_api_key")) {
      return envKey;
    }
    return null;
  }

  /**
   * Explains a GitHub repository in plain language using Sarvam AI
   */
  public static async explainRepository(repo: OssRepository, userQuery?: string): Promise<SarvamExplainerPayload> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        console.log("[Sarvam AI] Executing live API call for:", repo.name);
        const response = await fetch(SARVAM_API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": apiKey,
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "sarvam-105b-conversations",
            messages: [
              {
                role: "system",
                content: "You are an expert open-source software architect. Provide a concise, clear plain-language JSON summary of open-source repositories.",
              },
              {
                role: "user",
                content: `Analyze repository '${repo.fullName}'. Description: ${repo.description}. Use Case Query: ${userQuery || "General overview"}. Provide JSON output with fields: whatItSolves, techStack, maturity, whyRelevantToSearch, pros, cons, recommendedUseCases.`,
              },
            ],
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("[Sarvam AI] Live API Success (200 OK)", data);
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            try {
              const parsed = JSON.parse(content);
              return {
                whatItSolves: parsed.whatItSolves || repo.sarvamExplainer.whatItSolves,
                techStack: parsed.techStack || repo.sarvamExplainer.techStack,
                maturity: repo.sarvamExplainer.maturity,
                whyRelevantToSearch: parsed.whyRelevantToSearch || repo.sarvamExplainer.whyRelevantToSearch,
                pros: parsed.pros || repo.sarvamExplainer.pros,
                cons: parsed.cons || repo.sarvamExplainer.cons,
                recommendedUseCases: parsed.recommendedUseCases || repo.sarvamExplainer.recommendedUseCases,
              };
            } catch {
              // Fallback to pre-processed payload if JSON parse fails
            }
          }
        } else {
          console.error("[Sarvam AI] API Error Code:", response.status, await response.text());
        }
      } catch (err) {
        console.warn("[Sarvam AI] Live API call network error:", err);
      }
    } else {
      console.log("[Sarvam AI] No valid API key found in .env.local or localStorage. Using fast fallback.");
    }

    // Default fast-path Sarvam AI payload
    return repo.sarvamExplainer;
  }

  /**
   * Answers user questions about a specific GitHub repository in the Q&A playground
   */
  public static async askRepoQuestion(repo: OssRepository, question: string, history: QaMessage[]): Promise<{ answer: string; codeSnippet?: CodeSnippet }> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        console.log("[Sarvam AI Q&A] Calling live API for question:", question);
        const response = await fetch(SARVAM_API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": apiKey,
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "sarvam-105b-conversations",
            messages: [
              {
                role: "system",
                content: `You are an AI assistant answering questions about the repository '${repo.fullName}'. Direct answer with code snippet if asked.`,
              },
              ...history.map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
              })),
              { role: "user", content: question },
            ],
            temperature: 0.4,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("[Sarvam AI Q&A] Live API Success (200 OK)", data);
          const answerText = data.choices?.[0]?.message?.content;
          if (answerText) {
            return { answer: answerText };
          }
        } else {
          console.error("[Sarvam AI Q&A] API Error Code:", response.status, await response.text());
        }
      } catch (err) {
        console.warn("[Sarvam AI Q&A] Live API call network error:", err);
      }
    } else {
      console.log("[Sarvam AI Q&A] No valid API key found in .env.local or localStorage. Using intelligent fallback.");
    }

    // Intelligent fallback response based on question keywords & repo metadata
    const qLower = question.toLowerCase();
    
    if (qLower.includes("install") || qLower.includes("setup") || qLower.includes("start")) {
      return {
        answer: `To set up ${repo.name} in your project, run:\n\`\`\`bash\n${repo.integrationGuide.installCommand}\n\`\`\`\n\nConfiguration steps:\n${repo.integrationGuide.configSteps.map(s => `• ${s}`).join("\n")}`,
        codeSnippet: repo.integrationGuide.minimalSnippet,
      };
    }

    if (qLower.includes("license") || qLower.includes("commercial")) {
      return {
        answer: `${repo.name} is licensed under the **${repo.license}** license. This allows commercial usage, modification, and distribution as long as copyright notices are preserved.`,
      };
    }

    if (qLower.includes("performance") || qLower.includes("scale") || qLower.includes("fast")) {
      return {
        answer: `${repo.name} is written in **${repo.language}** with a quality score of **${repo.qualityScore}/100**. Its maintenance velocity is ${repo.maintainerHealth.toLowerCase()} with ${repo.monthlyCommitVelocity} commits/month.`,
      };
    }

    if (qLower.includes("mvp") || qLower.includes("startup") || qLower.includes("build")) {
      return {
        answer: `You can use ${repo.name} to launch a **${repo.mvpPathway.saasIdeaTitle}** in roughly ${repo.mvpPathway.estimatedBuildTime}. Key components you'll need to build:\n${repo.mvpPathway.missingComponentsToBuild.map(c => `1. ${c}`).join("\n")}`,
      };
    }

    return {
      answer: `Here is what the docs for **${repo.name}** say regarding your query:\n\n${repo.sarvamExplainer.whatItSolves}\n\n**Key Tech Stack:** ${repo.sarvamExplainer.techStack.join(", ")}.\n**Maturity:** ${repo.sarvamExplainer.maturity}.\n\nYou can inspect its full implementation at [${repo.fullName}](${repo.repoUrl}).`,
      codeSnippet: repo.integrationGuide.minimalSnippet,
    };
  }

  /**
   * Generates a "Build With This" MVP pathway for founders
   */
  public static generateMvpPathway(repo: OssRepository): MvpPathway {
    return repo.mvpPathway;
  }
}
