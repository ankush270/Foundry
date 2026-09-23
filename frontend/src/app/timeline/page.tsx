import TimelineView from "@/modules/timeline/components/TimelineView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Timeline",
  description: "Explore the chronological evolution of Y Combinator batches from 2005 to present day.",
};

export default function TimelinePage() {
  return <TimelineView />;
}
