"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface GsapTiltCardProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number;
}

export default function GsapTiltCard({
  children,
  className = "",
  maxRotation = 12,
}: GsapTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let cachedRect: DOMRect | null = null;

    const handleMouseEnter = () => {
      cachedRect = card.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedRect) {
        cachedRect = card.getBoundingClientRect();
      }
      const x = e.clientX - cachedRect.left;
      const y = e.clientY - cachedRect.top;

      const centerX = cachedRect.width / 2;
      const centerY = cachedRect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxRotation;
      const rotateY = ((x - centerX) / centerX) * maxRotation;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: "power2.out",
      });

      if (shineRef.current) {
        const shineOpacity = Math.min(0.25, Math.hypot(x - centerX, y - centerY) / (cachedRect.width / 2));
        gsap.to(shineRef.current, {
          background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 70%)`,
          opacity: shineOpacity,
          duration: 0.2,
        });
      }
    };

    const handleMouseLeave = () => {
      cachedRect = null;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      if (shineRef.current) {
        gsap.to(shineRef.current, {
          opacity: 0,
          duration: 0.4,
        });
      }
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxRotation]);

  return (
    <div
      ref={cardRef}
      className={`relative will-change-transform transform-gpu ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity"
      />
    </div>
  );
}
