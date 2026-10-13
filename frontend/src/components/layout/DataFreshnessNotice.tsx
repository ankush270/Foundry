"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { startups, allStartups } from "@/data/startups";
export default function DataFreshnessNotice() {
  const pathname=usePathname();
  const [now,setNow]=useState<number|null>(null);
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60000);const initial=setTimeout(()=>setNow(Date.now()),0);return()=>{clearInterval(timer);clearTimeout(initial);};},[]);
  if (!["/","/yc","/analytics","/graph","/timeline","/compare","/watchlist","/hall-of-fame","/trifecta","/games"].includes(pathname)) return null;
  const checked=startups.filter(s=>s.sourceCheckedAt && now!==null && now-Date.parse(s.sourceCheckedAt)<6*60*60*1000).length;
  return <p role="status" className="px-4 py-2 text-xs text-[var(--muted)] border-b border-[var(--border-color)]">
    YC dataset: {now===null?"checking freshness…":`${checked}/${startups.length} profiles checked in the last 6 hours.`} Company pages recheck their source when opened. {allStartups.length-startups.length} unverified identities excluded. Older snapshots are not guaranteed current.
  </p>;
}
