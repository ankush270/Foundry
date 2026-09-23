import {
  Home, Building2, Rocket, Code2, Clock, BarChart3, Network, Gamepad2, Trophy, Bookmark, Workflow, Newspaper
} from "lucide-react";

export const primaryNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tech-news", label: "Tech News", icon: Newspaper },
  { href: "/yc", label: "YC Startups", icon: Building2 },
  { href: "/producthunt", label: "Product Hunt", icon: Rocket },
  { href: "/githuboss", label: "GitHub OSS", icon: Code2 },
  { href: "/trifecta", label: "Trifecta 360°", icon: Workflow },
];

export const moreNavLinks = [
  { href: "/timeline", label: "Timeline", icon: Clock, desc: "Interactive cohort batch history" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, desc: "Ecosystem distribution & trends" },
  { href: "/graph", label: "DNA Graph", icon: Network, desc: "Interactive startup relationship matrix" },
  { href: "/games", label: "Games", icon: Gamepad2, desc: "Startup trivia & guessing games" },
  { href: "/hall-of-fame", label: "Hall of Fame", icon: Trophy, desc: "Top unicorn milestones" },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark, desc: "Saved startups & repositories" },
];

export const navLinks = [...primaryNavLinks, ...moreNavLinks];

