"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function GsapCounter({
  value,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
}: GsapCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const counterObj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counterObj, {
        val: value,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: node,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (node) {
            const formatted = counterObj.val.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
            node.innerText = `${prefix}${formatted}${suffix}`;
          }
        },
      });
    }, nodeRef);

    return () => ctx.revert();
  }, [value, duration, prefix, suffix, decimals]);

  const initialFormatted = (0).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={nodeRef} className={className}>
      {prefix}{initialFormatted}{suffix}
    </span>
  );
}
