import { NextResponse } from "next/server";
import { TechNewsApiService } from "@/services/technews/technews-api.service";
import type { TechNewsFilters } from "@/modules/technews/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.has("slug")) {
    const item = await TechNewsApiService.getNewsItemBySlug(params.get("slug") ?? "");
    return NextResponse.json({ success: Boolean(item), item }, { status: item ? 200 : 404 });
  }
  const positiveInteger = (key: string, fallback: number, max: number) => {
    const value = Number(params.get(key));
    return Number.isSafeInteger(value) && value > 0 ? Math.min(value, max) : fallback;
  };
  const result = await TechNewsApiService.getNewsItems({
    category: (params.get("category") || "All") as TechNewsFilters["category"],
    impactLevel: (params.get("impact") || "All") as TechNewsFilters["impactLevel"],
    sourceType: (params.get("sourceType") || "All") as TechNewsFilters["sourceType"],
    searchQuery: params.get("q") || "",
    sortBy: (params.get("sortBy") || "latest") as TechNewsFilters["sortBy"],
  }, { page: positiveInteger("page", 1, 10000), limit: positiveInteger("limit", 9, 100), forceRefresh: params.get("refresh") === "true" });
  return NextResponse.json({ success: true, ...result, data: result.items,
    source: result.source,
  });
}
