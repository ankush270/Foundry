import { NextResponse } from "next/server";
import { getStartupBySlug, getSimilarStartups } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const startup = getStartupBySlug(slug);
  if (!startup) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const similar = getSimilarStartups(startup, 4);
  return NextResponse.json({ data: startup, similar });
}
