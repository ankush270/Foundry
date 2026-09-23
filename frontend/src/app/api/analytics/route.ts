import { NextResponse } from "next/server";
import { startups } from "@/data/startups";
import {
  computePerYear, computeIndustryDistribution,
  computeStatusDistribution, computeCountryDistribution, computeAIGrowth
} from "@/services/analytics.service";

export async function GET() {
  return NextResponse.json({
    totalStartups: startups.length,
    perYear: computePerYear(startups),
    industries: computeIndustryDistribution(startups),
    statuses: computeStatusDistribution(startups),
    countries: computeCountryDistribution(startups),
    aiGrowth: computeAIGrowth(startups),
  });
}
