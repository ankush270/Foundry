"use client";
import Link from "next/link";
import { ArrowUpRight, Bookmark, Check, GitCompareArrows, MapPin, Users } from "lucide-react";
import type { Startup } from "@/data/types";
import { useWatchlistStore } from "@/store/watchlist.store";
import { useCompareStore } from "@/store/compare.store";
export default function StartupCard({ startup }: { startup: Startup; index?: number }) {
  const { ids, toggle } = useWatchlistStore();
  const { selected, add, remove } = useCompareStore();
  const saved = ids.includes(startup.id);
  const comparing = selected.some(item => item.id === startup.id);
  return <article className="saas-explorer-card">
    <div className="saas-explorer-card-top"><Link href={`/startup/${startup.slug}`} className="saas-explorer-logo"><img src={startup.logo} alt="" loading="lazy" onError={event=>{event.currentTarget.src="/founder-placeholder.svg";}}/></Link><span className="saas-batch">YC {startup.batch}</span><button className="saas-icon-button" aria-label={`${saved?"Unsave":"Save"} ${startup.name}`} aria-pressed={saved} onClick={()=>toggle(startup.id)}><Bookmark size={16} fill={saved?"currentColor":"none"}/></button></div>
    <h3><Link href={`/startup/${startup.slug}`}>{startup.name}<ArrowUpRight size={16}/></Link></h3><p>{startup.oneLiner}</p>
    <div className="saas-explorer-tags">{startup.industries.slice(0,2).map(industry=><span key={industry}>{industry}</span>)}</div>
    <div className="saas-explorer-meta"><span><MapPin size={12}/>{startup.location || startup.country}</span><span><Users size={12}/>{startup.teamSize || "—"}</span></div>
    <div className="saas-explorer-card-actions"><Link href={`/startup/${startup.slug}`}>View company <ArrowUpRight size={14}/></Link><button onClick={()=>comparing?remove(startup.id):add(startup)} disabled={!comparing&&selected.length>=3} aria-pressed={comparing} aria-label={`${comparing?"Remove":"Compare"} ${startup.name}`}>{comparing?<Check size={14}/>:<GitCompareArrows size={14}/>} {comparing?"Added":"Compare"}</button></div>
  </article>;
}
