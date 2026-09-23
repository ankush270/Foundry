// ── Analytics computation service ──

import type { Startup } from "@/data/types";

export function computePerYear(data: Startup[]) {
  const map: Record<number, number> = {};
  data.forEach((s) => { map[s.year] = (map[s.year] || 0) + 1; });
  return Object.entries(map)
    .map(([y, c]) => ({ year: Number(y), count: c }))
    .sort((a, b) => a.year - b.year);
}

export function computeIndustryDistribution(data: Startup[]) {
  const map: Record<string, number> = {};
  data.forEach((s) => s.industries?.forEach((i) => { map[i] = (map[i] || 0) + 1; }));
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function computeStatusDistribution(data: Startup[]) {
  const map: Record<string, number> = {};
  data.forEach((s) => { map[s.status] = (map[s.status] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function computeCountryDistribution(data: Startup[], limit = 10) {
  const map: Record<string, number> = {};
  data.forEach((s) => { 
    const country = s.country || "Unknown";
    map[country] = (map[country] || 0) + 1; 
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function computeCityDistribution(data: Startup[], limit = 10) {
  const map: Record<string, number> = {};
  data.forEach((s) => {
    const loc = s.location || "Remote";
    map[loc] = (map[loc] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function computeAIGrowth(data: Startup[]) {
  const map: Record<number, { total: number; ai: number }> = {};
  data.forEach((s) => {
    if (!map[s.year]) map[s.year] = { total: 0, ai: 0 };
    map[s.year].total++;
    const isAI = s.industries?.some((i) => i.toLowerCase().includes("ai")) || s.tags?.some((t) => t.toLowerCase().includes("ai"));
    if (isAI) map[s.year].ai++;
  });
  return Object.entries(map)
    .map(([y, d]) => ({ 
      year: Number(y), 
      total: d.total, 
      ai: d.ai,
      aiPct: d.total ? Math.round((d.ai / d.total) * 100) : 0
    }))
    .sort((a, b) => a.year - b.year);
}

export function computeTeamSizeDistribution(data: Startup[]) {
  const brackets = [
    { label: "1-10 employees", min: 1, max: 10, count: 0 },
    { label: "11-50 employees", min: 11, max: 50, count: 0 },
    { label: "51-200 employees", min: 51, max: 200, count: 0 },
    { label: "201-1000 employees", min: 201, max: 1000, count: 0 },
    { label: "1000+ enterprise", min: 1001, max: Infinity, count: 0 },
  ];

  data.forEach((s) => {
    const size = parseInt(s.teamSize || "1", 10);
    if (!isNaN(size)) {
      const match = brackets.find((b) => size >= b.min && size <= b.max);
      if (match) match.count++;
      else brackets[0].count++;
    } else {
      brackets[0].count++;
    }
  });

  return brackets.map((b) => ({ name: b.label, value: b.count }));
}

export function computeBatchSeasonDistribution(data: Startup[]) {
  const map: Record<string, number> = { Summer: 0, Winter: 0, Fall: 0 };
  data.forEach((s) => {
    const season = s.season || (s.batch.startsWith("W") ? "Winter" : s.batch.startsWith("F") ? "Fall" : "Summer");
    map[season] = (map[season] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function computeHiringIntelligence(data: Startup[]) {
  const hiringStartups = data.filter((s) => s.isHiring || (s.jobCount && s.jobCount > 0));
  const totalJobs = data.reduce((acc, s) => acc + (s.jobCount || (s.jobs ? s.jobs.length : 0)), 0);
  
  // Top hiring sectors
  const sectorJobsMap: Record<string, number> = {};
  hiringStartups.forEach((s) => {
    const count = s.jobCount || (s.jobs ? s.jobs.length : 1);
    s.industries?.forEach((ind) => {
      sectorJobsMap[ind] = (sectorJobsMap[ind] || 0) + count;
    });
  });

  const topHiringSectors = Object.entries(sectorJobsMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return {
    hiringCompanyCount: hiringStartups.length,
    totalJobs,
    topHiringSectors,
  };
}

export function computeKPIs(data: Startup[]) {
  const total = data.length;
  const active = data.filter((s) => s.status === "Active").length;
  const publicCount = data.filter((s) => s.status === "Public").length;
  const acquired = data.filter((s) => s.status === "Acquired").length;
  const unicorns = data.filter((s) => s.tags?.some((t) => ["Top Company", "Unicorn", "Public Company"].includes(t))).length;
  const hiring = data.filter((s) => s.isHiring).length;
  const totalJobs = data.reduce((acc, s) => acc + (s.jobCount || 0), 0);

  const activePct = total ? Math.round((active / total) * 100) : 0;
  const exitCount = publicCount + acquired;
  const exitPct = total ? Math.round((exitCount / total) * 100) : 0;

  return {
    total,
    active,
    activePct,
    publicCount,
    acquired,
    exitCount,
    exitPct,
    unicorns,
    hiring,
    totalJobs
  };
}

