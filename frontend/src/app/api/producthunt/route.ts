import { NextResponse } from "next/server";
import { SAMPLE_PRODUCTHUNT_PRODUCTS } from "@/data/producthunt-products";

export async function GET() {
  return NextResponse.json({
    data: SAMPLE_PRODUCTHUNT_PRODUCTS,
    total: SAMPLE_PRODUCTHUNT_PRODUCTS.length,
    isLive: false,
    source: "Curated Dataset",
    endCursor: null,
    hasNextPage: false,
  });
}

