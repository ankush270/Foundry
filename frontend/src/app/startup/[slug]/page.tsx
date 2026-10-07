import { Suspense } from "react";
import StartupDetailView from "@/modules/startup-detail/components/StartupDetailView";

export async function generateStaticParams() {
  return [{ slug: "demo" }];
}

export default function StartupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center doodle-font">Loading Startup Details...</div>}>
      <StartupDetailView params={params} />
    </Suspense>
  );
}

