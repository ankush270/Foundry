import { NextRequest, NextResponse } from "next/server";
import { TechNewsApiService } from "@/services/technews/technews-api.service";
import { ImpactLevel, NewsCategory, SourceType } from "@/modules/technews/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const slug = searchParams.get("slug") || searchParams.get("id");

    // If specific slug/id requested, resolve target news item directly
    if (slug) {
      const item = await TechNewsApiService.getNewsItemBySlug(slug);
      if (item) {
        return NextResponse.json({
          success: true,
          data: [item],
          item,
          total: 1,
        });
      }
    }

    const category = (searchParams.get("category") as NewsCategory | "All") || "All";
    const impactLevel = (searchParams.get("impact") as ImpactLevel | "All") || "All";
    const sourceType = (searchParams.get("sourceType") as SourceType | "All") || "All";
    const searchQuery = searchParams.get("q") || "";
    const sortBy = (searchParams.get("sortBy") as "latest" | "impact" | "opportunities" | "trending") || "latest";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const forceRefresh = searchParams.get("refresh") === "true";

    const result = await TechNewsApiService.getNewsItems(
      {
        category,
        impactLevel,
        sourceType,
        searchQuery,
        sortBy,
      },
      {
        page,
        limit,
        forceRefresh,
      }
    );

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      hasMore: result.hasMore,
      stats: result.stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch tech news items",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html, url, scrapeTextOnly } = body;

    if (url && scrapeTextOnly) {
      const scrapedText = await TechNewsApiService.fetchArticleRealContent(url);
      return NextResponse.json({
        success: true,
        text: scrapedText || "",
      });
    }

    if (html) {
      const items = TechNewsApiService.parseRawHtml(html, url || "https://techcrunch.com");
      return NextResponse.json({
        success: true,
        scrapedCount: items.length,
        items,
      });
    }

    if (url) {
      const scrapedText = await TechNewsApiService.fetchArticleRealContent(url);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      const pageHtml = await res.text();
      const items = TechNewsApiService.parseRawHtml(pageHtml, url);
      return NextResponse.json({
        success: true,
        scrapedCount: items.length,
        items,
        text: scrapedText || "",
      });
    }

    return NextResponse.json(
      { success: false, error: "Please provide either 'html' or 'url' in body" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Scraping failed" },
      { status: 500 }
    );
  }
}

