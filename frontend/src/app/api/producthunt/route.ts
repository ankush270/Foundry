import { NextResponse } from "next/server";

export const dynamic = "force-static";

import {
  ProductHuntProduct,
  ProductCategory,
  PricingModel,
} from "@/modules/producthunt/types";
import { SAMPLE_PRODUCTHUNT_PRODUCTS } from "@/data/producthunt-products";

const PRODUCTHUNT_GRAPHQL_API = "https://api.producthunt.com/v2/api/graphql";
const PRODUCTHUNT_RSS_FEED =
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.producthunt.com%2Ffeed";

// In-Memory Server Cache for initial page & rate limit fallback
let cachedProducts: ProductHuntProduct[] = [];
let cachedEndCursor: string | null = null;
let cachedHasNextPage: boolean = false;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

function extractImageFromHtml(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function generateLogoUrl(name: string, category: string): string {
  const seed = encodeURIComponent(name.trim());
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}&backgroundColor=f43f5e,6366f1,8b5cf6,ec4899`;
}

function detectCategoryFromText(text: string, topics: string[]): ProductCategory {
  const t = (text + " " + topics.join(" ")).toLowerCase();
  if (
    t.includes("ai") ||
    t.includes("gpt") ||
    t.includes("llm") ||
    t.includes("intelligence") ||
    t.includes("model") ||
    t.includes("copilot") ||
    t.includes("agent")
  ) {
    return "AI & Machine Learning";
  }
  if (
    t.includes("dev") ||
    t.includes("code") ||
    t.includes("database") ||
    t.includes("api") ||
    t.includes("infra") ||
    t.includes("cloud") ||
    t.includes("git") ||
    t.includes("cli")
  ) {
    return "DevTools & Infra";
  }
  if (
    t.includes("design") ||
    t.includes("ui") ||
    t.includes("creative") ||
    t.includes("figma") ||
    t.includes("canvas") ||
    t.includes("graphic")
  ) {
    return "Design & Creative";
  }
  if (
    t.includes("finance") ||
    t.includes("crypto") ||
    t.includes("pay") ||
    t.includes("web3") ||
    t.includes("fintech") ||
    t.includes("money")
  ) {
    return "Fintech & Web3";
  }
  if (
    t.includes("market") ||
    t.includes("seo") ||
    t.includes("sale") ||
    t.includes("email") ||
    t.includes("link") ||
    t.includes("growth")
  ) {
    return "Marketing & Sales";
  }
  if (
    t.includes("no-code") ||
    t.includes("mobile") ||
    t.includes("app") ||
    t.includes("ios") ||
    t.includes("android") ||
    t.includes("swift")
  ) {
    return "No-Code & Mobile";
  }
  return "Productivity & SaaS";
}

function deriveTechStack(cat: ProductCategory): string[] {
  switch (cat) {
    case "AI & Machine Learning":
      return ["Python", "FastAPI", "PyTorch", "Claude 3.5 Sonnet", "Next.js", "Vector DB"];
    case "DevTools & Infra":
      return ["TypeScript", "Node.js", "PostgreSQL", "Docker", "Go", "GraphQL"];
    case "Design & Creative":
      return ["React", "Tailwind CSS", "Canvas API", "WebGL", "Figma API"];
    case "Fintech & Web3":
      return ["Solidity", "Ethers.js", "Next.js", "PostgreSQL", "Stripe API"];
    case "Marketing & Sales":
      return ["Next.js", "Tailwind CSS", "Redis", "Tinybird", "PostgreSQL"];
    case "No-Code & Mobile":
      return ["React Native", "Expo", "Swift", "Flutter", "Firebase"];
    default:
      return ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Stripe"];
  }
}

function mapGraphQLNodeToProduct(node: any): ProductHuntProduct {
  const topicsList: string[] =
    node.topics?.edges?.map((t: any) => t.node?.name).filter(Boolean) || [];
  const category = detectCategoryFromText(
    node.name + " " + node.tagline + " " + (node.description || ""),
    topicsList
  );
  const votesCount = node.votesCount || 0;
  const slug = node.slug || node.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const firstMaker = node.makers && node.makers.length > 0 ? node.makers[0] : null;

  const score = Number((4.6 + (votesCount % 5) * 0.08).toFixed(1));
  const reviewsCount = Math.max(Math.round(votesCount / 14), 8);

  const rawLogo = node.thumbnail?.url;
  const logo =
    rawLogo && rawLogo.length > 5
      ? rawLogo
      : generateLogoUrl(node.name, category);
  const thumbnailUrl =
    rawLogo && rawLogo.length > 5
      ? rawLogo
      : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600";

  return {
    id: `ph-${node.id}`,
    name: node.name,
    slug,
    tagline: node.tagline || "Innovative product launched on Product Hunt.",
    description:
      node.description ||
      `${node.name} is a newly launched product designed to transform modern software and user workflows.`,
    logo,
    thumbnailUrl,
    mediaGallery: [thumbnailUrl],
    votesCount,
    commentsCount: node.commentsCount || Math.floor(votesCount / 10),
    launchDate: node.createdAt
      ? node.createdAt.split("T")[0]
      : new Date().toISOString().split("T")[0],
    launchedAtFormatted: node.createdAt
      ? new Date(node.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Today",
    featured: !!node.featuredAt,
    topics: topicsList.length > 0 ? topicsList : [category, "Product Hunt"],
    category,
    makers:
      Array.isArray(node.makers) && node.makers.length > 0
        ? node.makers.map((m: any) => ({
            name: m.name || "Product Maker",
            username: m.username || "producthunter",
            headline: m.headline || "Product Founder & Maker",
            avatar:
              m.profileImage ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
            productHuntUrl: `https://www.producthunt.com/@${m.username}`,
          }))
        : [
            {
              name: "Product Maker",
              username: "maker",
              headline: "Founder & Maker",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
            },
          ],
    websiteUrl: node.website || node.url || "https://producthunt.com",
    productHuntUrl: node.url || `https://www.producthunt.com/posts/${slug}`,
    pricingModel: "Freemium",
    techStack: deriveTechStack(category),
    aiExplainer: {
      problemSolved: `Eliminates key workflow bottlenecks in ${category} with modern interactive software architecture.`,
      uniqueValueProp: `Verified Product Hunt launch delivering state-of-the-art ${category} capabilities.`,
      targetAudience: [
        "Founders",
        "Software Engineers",
        "Product Managers",
        "Creators",
      ],
      whyItLaunched: `Launched on Product Hunt to reach early adopters and validate product market fit.`,
      techArchitecture: [
        "Modern Next.js & React frontend web interface",
        "High performance REST / GraphQL API server layer",
        "Relational PostgreSQL database with Redis caching layer",
      ],
      pros: [
        "Official Product Hunt launch",
        "Active founding team",
        "Modern responsive web app",
      ],
      cons: ["Inspect documentation before deploying at scale"],
    },
    cloneBlueprint: {
      saasCloneTitle: `AI Powered ${node.name} Competitor SaaS`,
      estimatedBuildTime: "2 to 3 Weeks",
      monetizationModel: "Freemium Subscription ($19/mo)",
      requiredApis: ["OpenAI / Claude API", "Stripe Billing", "Supabase DB"],
      architectureSteps: [
        "1. Initialize Next.js App Router project",
        "2. Configure authentication via Supabase Auth or Clerk",
        "3. Implement core features and subscription checkout via Stripe",
        "4. Deploy to Vercel with automated continuous deployment",
      ],
      databaseSchemaOutline: [
        "users (id, email, subscription_tier, created_at)",
        "projects (id, user_id, title, settings_json)",
      ],
      keyFeaturesChecklist: [
        "User Dashboard & Settings",
        "Stripe Billing Checkout",
        "Automated Notifications",
      ],
    },
    communityNotes: [
      "Live product fetched directly from Product Hunt GraphQL API v2",
    ],
    rating: { score: Math.min(score, 5.0), count: reviewsCount },
    badge: node.featuredAt ? "#1 Product of the Day" : "Featured Launch",
    makerComment: firstMaker
      ? {
          author: firstMaker.name,
          avatar: firstMaker.profileImage,
          text: `Hey Product Hunt! 👋 I'm ${firstMaker.name}. We built ${node.name} to solve key pain points in ${category}. We'd love your feedback!`,
          date: node.createdAt
            ? new Date(node.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Today",
        }
      : undefined,
    pricingTiers: [
      {
        name: "Starter / Hobby",
        price: "$0 / free",
        description: "Perfect for individual developers & small projects",
        features: [
          "Core feature access",
          "Community support",
          "Standard API rate limits",
        ],
        popular: false,
      },
      {
        name: "Pro / Builder",
        price: "$19 / mo",
        description: "For scaling products and active engineering teams",
        features: [
          "Unlimited access",
          "Priority 24/7 support",
          "Custom webhooks",
          "Analytics",
        ],
        popular: true,
      },
      {
        name: "Team / Enterprise",
        price: "$49 / mo",
        description: "Dedicated infrastructure and enterprise SLAs",
        features: ["Dedicated instances", "Custom SLA & SSO", "Unlimited seats"],
        popular: false,
      },
    ],
    keyFeatures: [
      {
        title: "Workflow Automation",
        description: `Automates key tasks in ${category} with instant processing.`,
      },
      {
        title: "High Performance Engine",
        description: "Sub-100ms response times with edge caching.",
      },
      {
        title: "Developer API & Webhooks",
        description: "Type-safe REST and GraphQL integration APIs.",
      },
    ],
    socialLinks: {
      twitter: firstMaker
        ? `https://twitter.com/${firstMaker.username}`
        : `https://twitter.com/${slug}`,
      github: `https://github.com/topics/${category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`,
    },
    techDetails: {
      hosting: "Vercel / Cloudflare Edge",
      framework: "Next.js App Router",
      database: "PostgreSQL + Redis",
      aiModels: ["Claude 3.5 Sonnet", "OpenAI GPT-4o"],
      compliance: ["GDPR Compliant", "256-bit SSL Encryption"],
    },
  };
}

export async function GET() {
  return NextResponse.json({
    data: SAMPLE_PRODUCTHUNT_PRODUCTS,
    total: SAMPLE_PRODUCTHUNT_PRODUCTS.length,
    isLive: false,
    source: "Curated Dataset",
    endCursor: null,
    hasNextPage: false,
  });
}

