import { Suspense } from "react";
import { getStartupBySlug } from "@/lib/utils";
import CompanyEcosystemView from "@/modules/cross-intelligence/components/CompanyEcosystemView";
import Link from "next/link";

export default async function StartupEcosystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const startup = getStartupBySlug(slug);

  if (!startup) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 font-sans">
        <div className="text-center doodle-card p-8 bg-white dark:bg-[#111827]">
          <h1 className="text-2xl font-bold doodle-font mb-2 text-[#263D5B] dark:text-[#49B6E5]">Startup Not Found</h1>
          <p className="text-[var(--muted)] mb-4 text-xs">The startup you&apos;re looking for doesn&apos;t exist in our database.</p>
          <Link href="/yc" className="doodle-btn px-4 py-2 text-xs inline-block">← Back to YC Explorer</Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-8 text-center doodle-font">Loading Business + Technology Ecosystem...</div>}>
      <CompanyEcosystemView startup={startup} />
    </Suspense>
  );
}
