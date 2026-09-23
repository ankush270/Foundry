"use client";

import { useState, useMemo } from "react";
import { 
  TrendingUp, 
  PieChart, 
  Globe2, 
  BarChart3, 
  Sparkles, 
  Users, 
  Briefcase, 
  Building2, 
  Trophy, 
  Filter, 
  RotateCcw,
  MapPin,
  Layers,
  Zap,
  CheckCircle2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend
} from "recharts";
import { startups } from "@/data/startups";
import { CHART_COLORS, STATUS_HEX } from "@/lib/constants";
import {
  computePerYear, 
  computeIndustryDistribution, 
  computeStatusDistribution,
  computeCountryDistribution, 
  computeCityDistribution,
  computeAIGrowth,
  computeTeamSizeDistribution,
  computeBatchSeasonDistribution,
  computeHiringIntelligence,
  computeKPIs
} from "@/services/analytics.service";
import BackLink from "@/components/ui/BackLink";
import PageHeader from "@/components/ui/PageHeader";
import GsapCounter from "@/components/animations/GsapCounter";
import GsapTiltCard from "@/components/animations/GsapTiltCard";

const ERA_FILTERS = [
  { label: "All Time", start: 2005, end: 2026 },
  { label: "Pioneer Era (2005-2008)", start: 2005, end: 2008 },
  { label: "Mobile Boom (2009-2014)", start: 2009, end: 2014 },
  { label: "SaaS Expansion (2015-2020)", start: 2015, end: 2020 },
  { label: "AI Revolution (2021-2026)", start: 2021, end: 2026 },
];

function ChartCard({ children, title, subtitle, icon: Icon, iconColor, className = "" }: {
  children: React.ReactNode; 
  title: string; 
  subtitle?: string;
  icon: React.ElementType; 
  iconColor: string; 
  className?: string;
}) {
  return (
    <GsapTiltCard maxRotation={3} className={`h-full ${className}`}>
      <div className="rounded-3xl border border-white/10 glass-card p-6 h-full flex flex-col justify-between shadow-xl">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            {title}
          </h3>
          {subtitle && <p className="text-xs text-[var(--muted)] mt-1">{subtitle}</p>}
        </div>
        <div className="grow">{children}</div>
      </div>
    </GsapTiltCard>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3.5 py-2.5 rounded-2xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-md text-xs z-50">
      <p className="font-bold text-white border-b border-white/10 pb-1 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5" style={{ color: p.color || p.fill }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
            {p.name}:
          </span>
          <span className="font-mono font-bold text-white">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsView() {
  // Filter States
  const [selectedEra, setSelectedEra] = useState<number>(0);
  const [selectedSeason, setSelectedSeason] = useState<string>("All");
  const [onlyHiring, setOnlyHiring] = useState<boolean>(false);

  // Filtered dataset
  const filteredStartups = useMemo(() => {
    const era = ERA_FILTERS[selectedEra];
    return startups.filter((s) => {
      const matchesEra = s.year >= era.start && s.year <= era.end;
      const matchesSeason = selectedSeason === "All" || (s.season || (s.batch.startsWith("W") ? "Winter" : "Summer")) === selectedSeason;
      const matchesHiring = !onlyHiring || s.isHiring;

      return matchesEra && matchesSeason && matchesHiring;
    });
  }, [selectedEra, selectedSeason, onlyHiring]);

  // Analytics service computations
  const kpis = useMemo(() => computeKPIs(filteredStartups), [filteredStartups]);
  const perYear = useMemo(() => computePerYear(filteredStartups), [filteredStartups]);
  const industries = useMemo(() => computeIndustryDistribution(filteredStartups), [filteredStartups]);
  const statuses = useMemo(() => computeStatusDistribution(filteredStartups), [filteredStartups]);
  const countries = useMemo(() => computeCountryDistribution(filteredStartups, 10), [filteredStartups]);
  const cities = useMemo(() => computeCityDistribution(filteredStartups, 8), [filteredStartups]);
  const aiGrowth = useMemo(() => computeAIGrowth(filteredStartups), [filteredStartups]);
  const teamSizes = useMemo(() => computeTeamSizeDistribution(filteredStartups), [filteredStartups]);
  const hiringIntel = useMemo(() => computeHiringIntelligence(filteredStartups), [filteredStartups]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-indigo-600/10 via-purple-500/5 to-pink-500/10 -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8">
        <BackLink />
        <PageHeader
          badgeText="Live Data Intelligence"
          title="Startup Analytics & Metrics"
          subtitle={`Interactive market trends, industry concentrations, exit rates, and hiring intelligence across ${filteredStartups.length} startups.`}
        />

        {/* --- DYNAMIC INTERACTIVE FILTER BAR --- */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">Analytics Data Filter</h3>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Slice dataset metrics by tech eras, batch seasons, and hiring status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {/* Era selector */}
              <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 p-1 text-xs overflow-x-auto max-w-full">
                {ERA_FILTERS.map((era, idx) => (
                  <button
                    key={era.label}
                    onClick={() => setSelectedEra(idx)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                      selectedEra === idx
                        ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30"
                        : "text-[var(--muted)] hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 font-semibold"
                    }`}
                  >
                    {era.label}
                  </button>
                ))}
              </div>

              {/* Season Selector */}
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-[var(--surface)] border border-white/10 text-xs text-[var(--foreground)] rounded-2xl px-3.5 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Seasons</option>
                <option value="Winter">Winter Batches (W)</option>
                <option value="Summer">Summer Batches (S)</option>
              </select>

              {/* Hiring Toggle */}
              <button
                onClick={() => setOnlyHiring(!onlyHiring)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                  onlyHiring
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30"
                    : "glass-card border-white/10 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-emerald-500/30"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                Hiring Companies Only
              </button>

              {/* Reset */}
              {(selectedEra !== 0 || selectedSeason !== "All" || onlyHiring) && (
                <button
                  onClick={() => {
                    setSelectedEra(0);
                    setSelectedSeason("All");
                    setOnlyHiring(false);
                  }}
                  className="p-2 rounded-2xl glass-card border border-white/10 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-indigo-500/40 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- EXECUTIVE KPI CARDS GRID --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-4 rounded-3xl glass-card border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-[var(--muted)] mb-2">
              <span className="text-xs font-medium">Filtered Startups</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold font-display text-[var(--foreground)]">
              <GsapCounter value={kpis.total} />
            </p>
            <p className="text-[10px] text-[var(--muted)] mt-1 font-mono">
              of {startups.length} total recorded
            </p>
          </div>

          <div className="p-4 rounded-3xl glass-card border border-emerald-500/20 bg-emerald-950/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-medium">Active Survival</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold font-display text-emerald-400">
              <GsapCounter value={kpis.activePct} />%
            </p>
            <p className="text-[10px] text-emerald-300/80 mt-1 font-mono">
              <GsapCounter value={kpis.active} /> active startups
            </p>
          </div>

          <div className="p-4 rounded-3xl glass-card border border-amber-500/20 bg-amber-950/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-medium">Exits (Public/Acquired)</span>
              <Trophy className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold font-display text-amber-400">
              <GsapCounter value={kpis.exitCount} />
            </p>
            <p className="text-[10px] text-amber-300/80 mt-1 font-mono">
              {kpis.exitPct}% exit rate
            </p>
          </div>

          <div className="p-4 rounded-3xl glass-card border border-purple-500/20 bg-purple-950/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs font-medium">YC Unicorns</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold font-display text-purple-400">
              <GsapCounter value={kpis.unicorns} />
            </p>
            <p className="text-[10px] text-purple-300/80 mt-1 font-mono">
              Top tier companies
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-3xl glass-card border border-blue-500/20 bg-blue-950/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-medium">Active Jobs</span>
              <Briefcase className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold font-display text-blue-400">
              <GsapCounter value={hiringIntel.totalJobs} />
            </p>
            <p className="text-[10px] text-blue-300/80 mt-1 font-mono">
              at <GsapCounter value={hiringIntel.hiringCompanyCount} /> startups
            </p>
          </div>
        </div>

        {/* --- MAIN CHARTS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart 1: Startups Per Year */}
          <ChartCard
            title="Startup Batch Creation Per Year"
            subtitle="Historical volume of YC investments over time"
            icon={BarChart3}
            iconColor="text-indigo-400"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={perYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Startups" radius={[6, 6, 0, 0]}>
                  {perYear.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 2: Industry Distribution Donut */}
          <ChartCard
            title="Industry Sector Concentration"
            subtitle="Top technology and market verticals breakdown"
            icon={PieChart}
            iconColor="text-pink-400"
          >
            <ResponsiveContainer width="100%" height={230}>
              <RPieChart>
                <Pie
                  data={industries.slice(0, 10)}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {industries.slice(0, 10).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {industries.slice(0, 8).map((ind, i) => (
                <span key={ind.name} className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  {ind.name} (<span className="text-[var(--foreground)] font-bold"><GsapCounter value={ind.value} /></span>)
                </span>
              ))}
            </div>
          </ChartCard>

          {/* Chart 3: AI Growth Trend */}
          <ChartCard
            title="AI Adoption & AI Startup Ratio Over Time"
            subtitle="Comparison of AI-focused startups vs total batch creation"
            icon={Sparkles}
            iconColor="text-purple-400"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={aiGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total Startups"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="ai"
                  name="AI Native Startups"
                  stroke="#c084fc"
                  fill="#c084fc"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 4: Team Scale & Employee Distribution */}
          <ChartCard
            title="Company Team Scale & Workforce Size"
            subtitle="Startup distribution across employee headcount brackets"
            icon={Users}
            iconColor="text-emerald-400"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={teamSizes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  width={130}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Companies" radius={[0, 6, 6, 0]}>
                  {teamSizes.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 5: Geographic Distribution (Countries) */}
          <ChartCard
            title="Top Countries by Startup Density"
            subtitle="Global headquarters & country breakdown"
            icon={Globe2}
            iconColor="text-blue-400"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={countries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Startups" radius={[6, 6, 0, 0]}>
                  {countries.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 1) % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 6: Top Startup Hub Cities */}
          <ChartCard
            title="Top Startup Hub Cities"
            subtitle="Major ecosystem cities where YC founders are based"
            icon={MapPin}
            iconColor="text-amber-400"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cities} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Startups" radius={[0, 6, 6, 0]}>
                  {cities.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 4) % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* --- HIRING INTELLIGENCE SPOTLIGHT --- */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-blue-950/10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-[var(--foreground)]">
                Job Market & Hiring Intelligence
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Key sectors currently hiring talent across the YC ecosystem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hiringIntel.topHiringSectors.map((sector, idx) => (
              <div
                key={sector.name}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[var(--muted)] font-mono">#{idx + 1} Sector</span>
                  <p className="font-bold text-sm text-[var(--foreground)] truncate mt-0.5">{sector.name}</p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {sector.value} roles
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

