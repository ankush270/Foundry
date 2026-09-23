import { Suspense } from "react";
import ExplorerView from "@/modules/explorer/components/ExplorerView";

export const metadata = {
  title: "Foundry | YC Startups",
  description: "Explore 3,400+ Y Combinator startups, founder details, hiring status, and batch analytics.",
};

export default function YcPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center doodle-font">Loading YC Explorer...</div>}>
      <ExplorerView />
    </Suspense>
  );
}
