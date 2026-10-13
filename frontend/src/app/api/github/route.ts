import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;
  const q = incoming.get("q")?.trim();
  if (!q || q.length > 1000) return NextResponse.json({error:"Invalid repository query"}, {status:400});
  const params = new URLSearchParams({q});
  const sort = incoming.get("sort");
  if (sort && ["stars","forks","updated"].includes(sort)) params.set("sort",sort);
  params.set("order","desc");
  for (const [key,max,fallback] of [["page",100,1],["per_page",100,30]] as const) {
    const n=Number(incoming.get(key));
    params.set(key,String(Number.isInteger(n)&&n>0?Math.min(n,max):fallback));
  }
  try {
    const headers: Record<string,string>={Accept:"application/vnd.github+json"};
    if (process.env.GITHUB_TOKEN) headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
    const response=await fetch(`https://api.github.com/search/repositories?${params}`,{headers,cache:"no-store",signal:AbortSignal.timeout(12000)});
    if (!response.ok) return NextResponse.json({error:"GitHub source unavailable or rate limited"},{status:response.status});
    return NextResponse.json(await response.json(),{headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({error:"GitHub request timed out"},{status:502}); }
}
