import TechNewsDetailClient from "@/modules/technews/components/TechNewsDetailClient";

export async function generateStaticParams() {
  return [{ slug: "demo" }];
}

export default function TechNewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <TechNewsDetailClient params={params} />;
}
