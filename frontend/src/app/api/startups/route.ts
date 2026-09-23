import { NextResponse } from "next/server";
import { startups } from "@/data/startups";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const industry = searchParams.get("industry");
  const status = searchParams.get("status");
  const batch = searchParams.get("batch");
  const country = searchParams.get("country");
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");

  let results = startups;
  if (industry) results = results.filter((s) => s.industries.includes(industry));
  if (status) results = results.filter((s) => s.status === status);
  if (batch) results = results.filter((s) => s.batch === batch);
  if (country) results = results.filter((s) => s.country === country);

  const total = results.length;
  const paginated = results.slice(offset, offset + limit);

  return NextResponse.json({ data: paginated, total, limit, offset });
}
