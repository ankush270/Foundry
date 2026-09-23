"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface GsapMagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function GsapMagnetic({
  children,
  strength = 0.35,
  className = "",
}: GsapMagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;

      gsap.to(el, {
        x,
        y,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
