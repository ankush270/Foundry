import { NextResponse } from "next/server";
import type { ProductHuntProduct } from "@/modules/producthunt/types";
export const dynamic = "force-dynamic";
interface Post {
  id: string; name: string; slug: string; tagline: string; description: string;
  votesCount: number; commentsCount: number; createdAt: string; featuredAt?: string; url: string; website: string;
  thumbnail?: { url: string }; topics?: { edges: { node: { name: string } }[] };
}
function mapPost(p: Post): ProductHuntProduct {
  const topics = p.topics?.edges.map(e => e.node.name) || [];
  const grouped: [ProductHuntProduct["category"], RegExp][] = [["AI & Machine Learning", /artificial intelligence|machine learning|ai /i], ["DevTools & Infra", /developer|api|open source/i], ["Design & Creative", /design|photo|video/i], ["Fintech & Web3", /fintech|finance|crypto/i], ["Marketing & Sales", /marketing|sales/i], ["No-Code & Mobile", /no.code|mobile/i], ["Productivity & SaaS", /productivity|task|saas/i]];
  const category = grouped.find(([,pattern]) => topics.some(topic => pattern.test(topic)))?.[0] || "All";
  return {
    id: p.id, name: p.name, slug: p.slug, tagline: p.tagline, description: p.description || p.tagline,
    logo: p.thumbnail?.url || "/founder-placeholder.svg", thumbnailUrl: p.thumbnail?.url || "",
    mediaGallery: [], votesCount: p.votesCount, commentsCount: p.commentsCount,
    launchDate: p.createdAt, launchedAtFormatted: p.createdAt, featured: Boolean(p.featuredAt),
    topics, category, makers: [],
    websiteUrl: p.website, productHuntUrl: p.url, pricingModel: "Unknown", techStack: [],
    aiExplainer: { problemSolved: p.tagline, uniqueValueProp: "Not assessed", targetAudience: [], whyItLaunched: "Not assessed", techArchitecture: [], pros: [], cons: [] },
    cloneBlueprint: { saasCloneTitle: p.name, estimatedBuildTime: "Not estimated", monetizationModel: "Not verified", requiredApis: [], architectureSteps: [], databaseSchemaOutline: [], keyFeaturesChecklist: [] },
    communityNotes: [],
  };
}
const fields = `id name slug tagline description votesCount commentsCount createdAt featuredAt url website thumbnail { url } topics { edges { node { name } } }`;
export async function GET(request: Request) {
  const token = process.env.PRODUCTHUNT_TOKEN;
  if (!token) return NextResponse.json({ error: "PRODUCTHUNT_TOKEN is not configured on the server", isLive: false }, { status: 503 });
  const params = new URL(request.url).searchParams;
  const limit = Number(params.get("limit"));
  const first = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 30;
  const slug = params.get("slug");
  try {
    const query = slug
      ? `query($slug:String!) { post(slug:$slug) { ${fields} } }`
      : `query($first:Int!, $after:String) { posts(first:$first, after:$after, order:NEWEST) { edges { node { ${fields} } } pageInfo { endCursor hasNextPage } totalCount } }`;
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      cache: "no-store", signal: AbortSignal.timeout(12000),
      body: JSON.stringify({ query, variables: slug ? {slug} : { first, after: params.get("cursor") || null } }),
    });
    if (!response.ok) throw new Error(`Product Hunt returned ${response.status}`);
    const result = await response.json();
    if (result.errors || !result.data) throw new Error("Product Hunt query failed");
    if (slug) return NextResponse.json({ product: result.data.post ? mapPost(result.data.post) : null }, {status: result.data.post ? 200 : 404});
    const posts = result.data.posts;
    if (!Array.isArray(posts?.edges)) throw new Error("Invalid source data");
    return NextResponse.json({ data: posts.edges.map((e: { node: Post }) => mapPost(e.node)), total: posts.totalCount, isLive: true, source: `Product Hunt API — checked ${new Date().toISOString()}`, ...posts.pageInfo }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Live Product Hunt unavailable. Retry shortly.", isLive: false }, { status: 502 });
  }
}
