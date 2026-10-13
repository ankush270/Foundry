import { NextResponse } from "next/server";
import { startups } from "@/data/startups";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const params=new URL(request.url).searchParams;
  const integer=(name:string, fallback:number,max:number)=>{const raw=params.get(name);if(raw===null)return fallback;const n=Number(raw);return Number.isInteger(n)&&n>=0?Math.min(n,max):fallback;};
  const limit=Math.max(1,integer("limit",50,200));
  const offset=integer("offset",0,startups.length);
  return NextResponse.json({data:startups.slice(offset,offset+limit),total:startups.length,limit,offset,hasMore:offset+limit<startups.length,source:"Scheduled source-checked YC dataset; individual records include sourceCheckedAt"},{headers:{"Cache-Control":"no-store"}});
}
