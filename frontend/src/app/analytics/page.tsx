import AnalyticsView from "@/modules/analytics/components/AnalyticsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Analytics",
  description: "Deep dive into YC startup growth metrics, industry distributions, top locations, and batch trends.",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
