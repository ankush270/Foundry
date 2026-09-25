import ProductHuntDetailView from "@/modules/producthunt/components/ProductHuntDetailView";

export async function generateStaticParams() {
  return [{ id: "demo" }];
}

export default function ProductHuntDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductHuntDetailView params={params} />;
}

