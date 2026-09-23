import { ProductHuntExplorer } from "@/modules/producthunt/components/ProductHuntExplorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Product Hunt",
  description: "Discover top-voted Product Hunt products, analyze maker stories, AI architecture explainers, and step-by-step SaaS clone build blueprints.",
};

export default function ProductHuntPage() {
  return <ProductHuntExplorer />;
}
