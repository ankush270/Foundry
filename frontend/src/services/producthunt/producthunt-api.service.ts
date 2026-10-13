import {
  ProductHuntProduct,
  ProductHuntFilterOptions,
} from "@/modules/producthunt/types";
import { SAMPLE_PRODUCTHUNT_PRODUCTS } from "@/data/producthunt-products";

export class ProductHuntApiService {
  /**
   * Retrieves Product Hunt API token if configured by user in browser localStorage or process.env
   */
  public static getProductHuntToken(): string | null {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("PRODUCTHUNT_TOKEN")?.trim();
      if (localToken && localToken.length > 5) return localToken;
    }
    const envToken =
      process.env.NEXT_PUBLIC_PRODUCTHUNT_TOKEN?.trim() ||
      process.env.PRODUCTHUNT_TOKEN?.trim();
    if (envToken && envToken.length > 5) return envToken;
    return null;
  }

  /**
   * Saves Product Hunt token to localStorage
   */
  public static setProductHuntToken(token: string): void {
    if (typeof window !== "undefined") {
      if (token.trim()) {
        localStorage.setItem("PRODUCTHUNT_TOKEN", token.trim());
      } else {
        localStorage.removeItem("PRODUCTHUNT_TOKEN");
      }
    }
  }

  /**
   * Preserve source fields without inventing missing product claims.
   */
  public static enrichProductDetails(product: ProductHuntProduct): ProductHuntProduct {
    return { ...product };
  }

  /**
   * Retrieves a single product by ID or slug from live data first, then sample fallback
   */
  public static async getProductByIdOrSlug(idOrSlug: string): Promise<ProductHuntProduct | null> {
    if (!idOrSlug) return null;
    const decoded = decodeURIComponent(idOrSlug).toLowerCase().trim();

    const response = await fetch(`/api/producthunt?slug=${encodeURIComponent(decoded)}`, {cache:"no-store", signal:AbortSignal.timeout(15000)});
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Product Hunt live detail unavailable. Please retry.");
    return (await response.json()).product || null;
  }

  /**
   * Main query method to search, filter, and fetch products from `/api/producthunt` route
   */
  public static async fetchProducts(
    options: ProductHuntFilterOptions = {}
  ): Promise<{
    products: ProductHuntProduct[];
    isLive: boolean;
    source: string;
    totalCount: number;
    endCursor?: string | null;
    hasNextPage?: boolean;
    error?: string;
  }> {
    const limit = options.limit || 180;

    try {
      let apiUrl = `/api/producthunt?limit=${limit}`;
      if (options.cursor) {
        apiUrl += `&cursor=${encodeURIComponent(options.cursor)}`;
      }
      if (options.refresh) {
        apiUrl += `&refresh=true`;
      }


      const response = await fetch(apiUrl, { cache: "no-store", signal: AbortSignal.timeout(15000) });
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json.data)) {
          console.log(`[ProductHunt Service] Fetched ${json.data.length} products`);
          
          // Pure live products - DO NOT mix in sample data!
          const liveProducts: ProductHuntProduct[] = json.data;
          const filtered = this.filterAndSortProducts(liveProducts, options);

          return {
            products: filtered,
            isLive: json.isLive === true,
            source: json.source || "Official Product Hunt GraphQL API v2",
            totalCount: filtered.length,
            endCursor: json.endCursor,
            hasNextPage: json.hasNextPage,
          };
        }
      }
    } catch (err) {
      console.warn("[ProductHunt Service] API route fetch failed, trying direct fallback:", err);
    }

    return { products: [], isLive: false, source: "Live Product Hunt unavailable — no sample data shown", totalCount: 0, hasNextPage: false, endCursor: null };
  }

  /**
   * Helper: Filters and sorts products array
   */
  private static filterAndSortProducts(
    list: ProductHuntProduct[],
    options: ProductHuntFilterOptions
  ): ProductHuntProduct[] {
    const {
      query = "",
      category = "All",
      topic = "All",
      pricingModel = "All",
      timeframe = "All",
      sortBy = "votes",
    } = options;

    let filtered = [...list];

    // Deduplicate by ID
    const seenIds = new Set<string>();
    filtered = filtered.filter((p) => {
      if (!p.id || seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return true;
    });

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q)) ||
          p.techStack.some((ts) => ts.toLowerCase().includes(q))
      );
    }

    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (topic && topic !== "All") {
      filtered = filtered.filter((p) =>
        p.topics.some((t) => t.toLowerCase() === topic.toLowerCase())
      );
    }

    if (pricingModel && pricingModel !== "All") {
      filtered = filtered.filter((p) => p.pricingModel === pricingModel);
    }

    if (timeframe === "Featured") {
      filtered = filtered.filter((p) => p.featured);
    } else if (timeframe === "Top Voted") {
      filtered = filtered.filter((p) => p.votesCount >= 100);
    } else if (timeframe === "Today" || timeframe === "This Week") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      if (timeframe === "This Week") start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((product) => {
        const date = new Date(`${product.launchDate}T00:00:00`).getTime();
        return date >= start.getTime() && date <= end.getTime();
      });
    }

    if (sortBy === "votes") {
      filtered = filtered.sort((a, b) => b.votesCount - a.votesCount);
    } else if (sortBy === "comments") {
      filtered = filtered.sort((a, b) => b.commentsCount - a.commentsCount);
    } else if (sortBy === "date") {
      filtered = filtered.sort(
        (a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
      );
    } else if (sortBy === "relevance") {
      const terms = (options.query || "").toLowerCase().split(/\s+/).filter(Boolean);
      const relevance = (p: ProductHuntProduct) => terms.reduce((n, term) => n + (`${p.name} ${p.tagline}`.toLowerCase().includes(term) ? 1 : 0), 0);
      filtered = filtered.sort((a, b) => relevance(b) - relevance(a));
    }

    return filtered;
  }
}
