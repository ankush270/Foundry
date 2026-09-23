// ── Shared constants used across the application ──

export const CHART_COLORS = [
  "#49B6E5", "#263D5B", "#16A34A", "#D97706", "#DC2626",
  "#38A2D1", "#1E2E44", "#22C55E", "#F59E0B", "#EF4444",
];

export const STATUS_COLORS: Record<string, string> = {
  Active: "bg-[#16A34A]/15 text-[#16A34A] border-2 border-[#16A34A]",
  Public: "bg-[#49B6E5]/15 text-[#49B6E5] border-2 border-[#49B6E5]",
  Acquired: "bg-[#D97706]/15 text-[#D97706] border-2 border-[#D97706]",
  Inactive: "bg-[#DC2626]/15 text-[#DC2626] border-2 border-[#DC2626]",
};

export const STATUS_TEXT_COLORS: Record<string, string> = {
  Active: "text-[#16A34A]",
  Public: "text-[#49B6E5]",
  Acquired: "text-[#D97706]",
  Inactive: "text-[#DC2626]",
};

export const STATUS_HEX: Record<string, string> = {
  Active: "#16A34A",
  Public: "#49B6E5",
  Acquired: "#D97706",
  Inactive: "#DC2626",
};

export const GRAPH_NODE_COLORS: Record<string, string> = {
  startup: "#49B6E5",
  industry: "#263D5B",
  founder: "#16A34A",
  batch: "#D97706",
};

export const PAGE_SIZE = 24;
