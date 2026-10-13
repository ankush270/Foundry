import { NextResponse } from "next/server";
import { getStartupBySlug } from "@/lib/utils";
import { refreshYCProfile } from "@/lib/yc-refresh";
export const dynamic = "force-dynamic";
export async function GET(_req: Request, { params }: { params: Promise<{slug: string}> }) {
  const {slug} = await params;
  const previous = getStartupBySlug(slug);
  if (!previous) return NextResponse.json({error:"Not found"}, {status:404});
  try { return NextResponse.json({data:await refreshYCProfile(previous), isLive:true}, {headers:{"Cache-Control":"no-store"}}); }
  catch { return NextResponse.json({error:"YC source unavailable. The saved profile is not verified as current.", isLive:false}, {status:503}); }
}
