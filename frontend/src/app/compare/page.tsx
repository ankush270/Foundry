import CompareView from "@/modules/compare/components/CompareView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Compare",
  description: "Compare YC startups side-by-side on team size, funding, valuation, stack, and market focus.",
};

export default function ComparePage() {
  return <CompareView />;
}
