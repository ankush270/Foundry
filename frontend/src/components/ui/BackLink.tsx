"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  href?: string;
  label?: string;
}

export default function BackLink({ href = "/", label = "Back to Explorer" }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6"
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </Link>
  );
}
