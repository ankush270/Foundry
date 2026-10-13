"use client";
import { useEffect, useState } from "react";

/** Refresh while visible, and recheck when returning to the tab. */
export function useRefreshTick(intervalMs = 5 * 60 * 1000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const refresh = () => { if (!document.hidden) setTick(value => value + 1); };
    const timer = setInterval(refresh, intervalMs);
    document.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [intervalMs]);
  return tick;
}
