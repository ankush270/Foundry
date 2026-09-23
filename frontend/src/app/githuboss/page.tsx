import { Suspense } from "react";
import { GithubOssExplorer } from "@/modules/githuboss/components/GithubOssExplorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foundry | Open Source",
  description: "Transform GitHub open-source discovery into an intelligent, use-case driven matching engine powered by Sarvam AI.",
};

export default function GithubOssPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-slate-400">Loading Open Source Explorer...</div>}>
      <GithubOssExplorer />
    </Suspense>
  );
}
