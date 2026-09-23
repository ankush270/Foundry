import GraphView from "@/modules/graph/components/GraphView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | 3D Graph",
  description: "Visualize YC startups, industries, technologies, and batches in a 3D interconnected graph.",
};

export default function GraphPage() {
  return <GraphView />;
}
