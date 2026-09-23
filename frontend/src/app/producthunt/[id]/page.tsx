import ProductHuntDetailView from "@/modules/producthunt/components/ProductHuntDetailView";

export default function ProductHuntDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductHuntDetailView params={params} />;
}
