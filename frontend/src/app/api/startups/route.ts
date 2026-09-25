import { NextResponse } from "next/server";
export const dynamic = "force-static";
import { startups } from "@/data/startups";

export async function GET() {
  return NextResponse.json({ data: startups.slice(0, 50), total: startups.length, limit: 50, offset: 0 });
}
