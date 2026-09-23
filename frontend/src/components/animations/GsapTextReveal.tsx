"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  scale?: number;
}

export function GsapTextReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.8,
  scale = 1,
}: Props) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    if (direction === "up") y = 40;
    if (direction === "down") y = -40;
    if (direction === "left") x = 40;
    if (direction === "right") x = -40;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x,
          y,
          scale: scale < 1 ? scale : 1,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, textRef);

    return () => ctx.revert();
  }, [delay, direction, duration, scale]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}

export function GsapScrollGrid({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const items = grid.children;
      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 45,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={gridRef} className={className}>
      {children}
    </div>
  );
}

export function GsapStaggerList({
  children,
  className = "",
  stagger = 0.05,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        list.children,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: list,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={listRef} className={className}>
      {children}
    </div>
  );
}
