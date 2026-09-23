import type { Startup } from "./types";
import { startups } from "./startups";

export interface HallOfFameEntry {
  startupSlug: string;
  name: string;
  category: string;
  metric: string;
  detail: string;
  rank: number;
  batch: string;
  logo: string;
  oneLiner: string;
  founderName?: string;
}

export interface LeaderboardCategory {
  id: string;
  category: string;
  description: string;
  iconName: string;
  entries: HallOfFameEntry[];
}

export function getHallOfFame(): LeaderboardCategory[] {
  const getLogo = (slug: string) => startups.find((s) => s.slug === slug)?.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80";
  const getOneLiner = (slug: string) => startups.find((s) => s.slug === slug)?.oneLiner || "Leading technology pioneer.";
  const getBatch = (slug: string) => startups.find((s) => s.slug === slug)?.batch || "YC";
  const getFounder = (slug: string) => startups.find((s) => s.slug === slug)?.founders?.[0]?.name || "Founding Team";

  return [
    {
      id: "valuable",
      category: "Most Valuable Giants",
      description: "Highest estimated market capitalization & valuation tier in YC history.",
      iconName: "DollarSign",
      entries: [
        {
          startupSlug: "stripe",
          name: "Stripe",
          category: "Most Valuable Giants",
          metric: "$95 Billion+",
          detail: "Financial infrastructure for the internet",
          rank: 1,
          batch: getBatch("stripe"),
          logo: getLogo("stripe"),
          oneLiner: getOneLiner("stripe"),
          founderName: "Patrick & John Collison"
        },
        {
          startupSlug: "airbnb",
          name: "Airbnb",
          category: "Most Valuable Giants",
          metric: "$80 Billion+",
          detail: "Global travel marketplace",
          rank: 2,
          batch: getBatch("airbnb"),
          logo: getLogo("airbnb"),
          oneLiner: getOneLiner("airbnb"),
          founderName: "Brian Chesky & Joe Gebbia"
        },
        {
          startupSlug: "doordash",
          name: "DoorDash",
          category: "Most Valuable Giants",
          metric: "$50 Billion+",
          detail: "On-demand local delivery leader",
          rank: 3,
          batch: getBatch("doordash"),
          logo: getLogo("doordash"),
          oneLiner: getOneLiner("doordash"),
          founderName: "Tony Xu"
        },
        {
          startupSlug: "coinbase",
          name: "Coinbase",
          category: "Most Valuable Giants",
          metric: "$45 Billion+",
          detail: "Global crypto exchange platform",
          rank: 4,
          batch: getBatch("coinbase"),
          logo: getLogo("coinbase"),
          oneLiner: getOneLiner("coinbase"),
          founderName: "Brian Armstrong"
        },
        {
          startupSlug: "reddit",
          name: "Reddit",
          category: "Most Valuable Giants",
          metric: "$15 Billion+",
          detail: "The front page of the internet",
          rank: 5,
          batch: getBatch("reddit"),
          logo: getLogo("reddit"),
          oneLiner: getOneLiner("reddit"),
          founderName: "Steve Huffman & Alexis Ohanian"
        },
      ],
    },
    {
      id: "ipo",
      category: "Fastest to IPO / Public",
      description: "Fastest scale from YC demo day to ringing the Bell on Nasdaq/NYSE.",
      iconName: "Zap",
      entries: [
        {
          startupSlug: "gitlab",
          name: "GitLab",
          category: "Fastest to IPO",
          metric: "6 Years",
          detail: "Public IPO on Nasdaq (GTLB)",
          rank: 1,
          batch: getBatch("gitlab"),
          logo: getLogo("gitlab"),
          oneLiner: getOneLiner("gitlab"),
          founderName: "Sid Sijbrandij"
        },
        {
          startupSlug: "doordash",
          name: "DoorDash",
          category: "Fastest to IPO",
          metric: "7 Years",
          detail: "Public IPO on NYSE (DASH)",
          rank: 2,
          batch: getBatch("doordash"),
          logo: getLogo("doordash"),
          oneLiner: getOneLiner("doordash"),
          founderName: "Tony Xu"
        },
        {
          startupSlug: "coinbase",
          name: "Coinbase",
          category: "Fastest to IPO",
          metric: "9 Years",
          detail: "Direct Listing on Nasdaq (COIN)",
          rank: 3,
          batch: getBatch("coinbase"),
          logo: getLogo("coinbase"),
          oneLiner: getOneLiner("coinbase"),
          founderName: "Brian Armstrong"
        },
        {
          startupSlug: "dropbox",
          name: "Dropbox",
          category: "Fastest to IPO",
          metric: "11 Years",
          detail: "Public IPO on Nasdaq (DBX)",
          rank: 4,
          batch: getBatch("dropbox"),
          logo: getLogo("dropbox"),
          oneLiner: getOneLiner("dropbox"),
          founderName: "Drew Houston"
        },
        {
          startupSlug: "airbnb",
          name: "Airbnb",
          category: "Fastest to IPO",
          metric: "12 Years",
          detail: "Public IPO on Nasdaq (ABNB)",
          rank: 5,
          batch: getBatch("airbnb"),
          logo: getLogo("airbnb"),
          oneLiner: getOneLiner("airbnb"),
          founderName: "Brian Chesky"
        },
      ],
    },
    {
      id: "acquisitions",
      category: "Billion-Dollar Acquisitions",
      description: "Highest profile mega M&A transactions acquired by tech tech titans.",
      iconName: "TrendingUp",
      entries: [
        {
          startupSlug: "segment",
          name: "Segment",
          category: "Billion-Dollar Acquisitions",
          metric: "$3.2 Billion",
          detail: "Acquired by Twilio",
          rank: 1,
          batch: getBatch("segment"),
          logo: getLogo("segment"),
          oneLiner: getOneLiner("segment"),
          founderName: "Peter Reinhardt"
        },
        {
          startupSlug: "cruise",
          name: "Cruise",
          category: "Billion-Dollar Acquisitions",
          metric: "$1.0 Billion+",
          detail: "Acquired by General Motors",
          rank: 2,
          batch: getBatch("cruise"),
          logo: getLogo("cruise"),
          oneLiner: getOneLiner("cruise"),
          founderName: "Kyle Vogt"
        },
        {
          startupSlug: "loom",
          name: "Loom",
          category: "Billion-Dollar Acquisitions",
          metric: "$975 Million",
          detail: "Acquired by Atlassian",
          rank: 3,
          batch: getBatch("loom"),
          logo: getLogo("loom"),
          oneLiner: getOneLiner("loom"),
          founderName: "Joe Thomas"
        },
        {
          startupSlug: "twitch",
          name: "Twitch",
          category: "Billion-Dollar Acquisitions",
          metric: "$970 Million",
          detail: "Acquired by Amazon",
          rank: 4,
          batch: getBatch("twitch"),
          logo: getLogo("twitch"),
          oneLiner: getOneLiner("twitch"),
          founderName: "Emmett Shear & Justin Kan"
        },
        {
          startupSlug: "optimizely",
          name: "Optimizely",
          category: "Billion-Dollar Acquisitions",
          metric: "$600 Million",
          detail: "Acquired by Episerver",
          rank: 5,
          batch: getBatch("optimizely"),
          logo: getLogo("optimizely"),
          oneLiner: getOneLiner("optimizely"),
          founderName: "Dan Siroker"
        },
      ],
    },
    {
      id: "ai",
      category: "AI & Foundation Model Trailblazers",
      description: "Pioneers defining generative AI, LLMs, and autonomous software intelligence.",
      iconName: "Sparkles",
      entries: [
        {
          startupSlug: "openai",
          name: "OpenAI",
          category: "AI Trailblazers",
          metric: "ChatGPT & GPT-4o",
          detail: "Artificial General Intelligence pioneer",
          rank: 1,
          batch: getBatch("openai"),
          logo: getLogo("openai"),
          oneLiner: getOneLiner("openai"),
          founderName: "Sam Altman"
        },
        {
          startupSlug: "scale-ai",
          name: "Scale AI",
          category: "AI Trailblazers",
          metric: "Data Infrastructure",
          detail: "Valued at $138B+",
          rank: 2,
          batch: getBatch("scale-ai"),
          logo: getLogo("scale-ai"),
          oneLiner: getOneLiner("scale-ai"),
          founderName: "Alexandr Wang"
        },
        {
          startupSlug: "supabase",
          name: "Supabase",
          category: "AI Trailblazers",
          metric: "Vector & Postgres AI",
          detail: "Open source Firebase alternative",
          rank: 3,
          batch: getBatch("supabase"),
          logo: getLogo("supabase"),
          oneLiner: getOneLiner("supabase"),
          founderName: "Paul Copplestone"
        },
        {
          startupSlug: "helicone",
          name: "Helicone",
          category: "AI Trailblazers",
          metric: "LLM Observability",
          detail: "AI API monitoring platform",
          rank: 4,
          batch: getBatch("helicone"),
          logo: getLogo("helicone"),
          oneLiner: getOneLiner("helicone"),
          founderName: "Scott Nguyen"
        },
        {
          startupSlug: "suno",
          name: "Suno",
          category: "AI Trailblazers",
          metric: "Music Generation",
          detail: "Multimodal audio foundation model",
          rank: 5,
          batch: getBatch("suno"),
          logo: getLogo("suno"),
          oneLiner: getOneLiner("suno"),
          founderName: "Mikey Shulman"
        },
      ],
    },
  ];
}

