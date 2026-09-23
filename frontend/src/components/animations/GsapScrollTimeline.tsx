"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapScrollTimelineProps {
  children: ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
}

export default function GsapScrollTimeline({
  children,
  className = "",
  itemSelector = ".timeline-item",
  stagger = 0.02,
}: GsapScrollTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(itemSelector);
    if (items.length === 0) return;

    // Immediately ensure items are visible if GSAP context hasn't run
    gsap.set(items, { opacity: 1, y: 0, scale: 1 });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: Math.min(stagger, 0.02),
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [children, itemSelector, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

