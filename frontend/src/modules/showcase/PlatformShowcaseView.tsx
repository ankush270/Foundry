"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Bookmark, Building2, Check, Code2, GitCompareArrows, Layers, Network, Newspaper, Search, Sparkles } from "lucide-react";
import { startups } from "@/data/startups";
import { useWatchlistStore } from "@/store/watchlist.store";
import LandingFaqAccordion from "@/components/showcase/LandingFaqAccordion";

const featured = ["stripe", "airbnb", "supabase", "retool"].flatMap(slug => { const item = startups.find(s => s.slug === slug); return item ? [item] : []; });
const hubs = [
  { icon: Building2, title: "Find the next big company", description: "Explore YC companies, their founders, batches and open roles. Find the details behind the idea.", label: "Explore YC startups", href: "/yc", color: "violet" },
  { icon: Code2, title: "Start with better building blocks", description: "Discover open-source projects by the problem they solve. Compare tools before you commit.", label: "Discover open source", href: "/githuboss", color: "blue" },
  { icon: Newspaper, title: "See what changes next", description: "Follow technology news and explore what it could mean for your next product.", label: "Read the latest news", href: "/tech-news", color: "pink" },
];
export default function PlatformShowcaseView() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { ids, toggle } = useWatchlistStore();
  return <div className="premium-home">
    <section className="saas-hero">
      <div className="saas-hero-art" aria-hidden="true"><div className="saas-ribbon ribbon-one"/><div className="saas-ribbon ribbon-two"/><div className="saas-ribbon ribbon-three"/><div className="saas-art-caption"><span>Connect the dots.</span><br/>Build what&apos;s next.<span className="saas-art-line"/></div></div>
      <div className="saas-container saas-hero-content">
        <Link href="/trifecta" className="saas-announcement"><span><Sparkles size={12}/> THE FOUNDRY ADVANTAGE</span> Ideas meet opportunity <ArrowRight size={13}/></Link>
        <h1>Discover your<br/>next <span>big idea.</span></h1>
        <p className="saas-hero-description">Great companies start with a little curiosity.<br className="saas-wide-break"/> Explore startups, open-source tools and product launches—all in one place.</p>
        <form className="saas-search" role="search" onSubmit={event=>{event.preventDefault();router.push(query.trim()?`/yc?search=${encodeURIComponent(query.trim())}`:"/yc");}}>
          <Search size={19}/><input aria-label="Search startups" placeholder="Search companies, ideas or technologies..." value={query} onChange={event=>setQuery(event.target.value)}/><button type="submit" aria-label="Search"><ArrowRight size={20}/></button>
        </form>
        <div className="saas-topic-links"><Link href="/yc"><Building2 size={13}/> YC startups</Link><Link href="/githuboss"><Code2 size={13}/> Open source</Link><Link href="/producthunt"><Layers size={13}/> Product launches</Link><Link href="/tech-news"><Newspaper size={13}/> Tech news</Link></div>
        <p className="saas-hero-footnote"><span className="saas-small-dot"/> Built for curious founders, developers and investors.</p>
      </div>
    </section>
    <section className="saas-container saas-featured" aria-labelledby="featured-heading">
      <div className="saas-section-heading"><div><span className="saas-eyebrow">A LITTLE INSPIRATION</span><h2 id="featured-heading">Big ideas. Real companies.</h2></div><Link href="/yc" className="saas-text-link">Explore all {startups.length} companies <ArrowRight size={16}/></Link></div>
      <div className="saas-featured-grid">{featured.map((startup,index)=><article className="saas-company-card" key={startup.id}>
        <div className="saas-company-top"><Link href={`/startup/${startup.slug}`} className={`saas-company-logo logo-${index}`} aria-label={startup.name}>{startup.name.slice(0,1)}</Link><button className={`saas-icon-button ${ids.includes(startup.id)?"is-saved":""}`} onClick={()=>toggle(startup.id)} aria-label={`${ids.includes(startup.id)?"Unsave":"Save"} ${startup.name}`} aria-pressed={ids.includes(startup.id)}><Bookmark size={17} fill={ids.includes(startup.id)?"currentColor":"none"}/></button></div>
        <h3><Link href={`/startup/${startup.slug}`}>{startup.name}<ArrowUpRight size={15}/></Link></h3><p>{startup.oneLiner}</p>
        <div className="saas-company-footer"><span>{startup.industries[0]}</span><span>{startup.batch}</span></div>
      </article>)}</div>
    </section>
    <section className="saas-source-strip saas-container"><span>ONE CONNECTED RESEARCH SPACE</span><div><Building2 size={19}/> Y Combinator</div><div><Code2 size={19}/> GitHub</div><div><Layers size={19}/> Product Hunt</div><div><Newspaper size={19}/> Tech news</div></section>
    <section className="saas-container saas-discover"><div className="saas-section-heading"><div><span className="saas-eyebrow">LESS TAB SWITCHING. MORE DISCOVERY.</span><h2>Your next move starts here.</h2></div><p>From the first spark to a clearer direction.<br/>Make room for better research.</p></div><div className="saas-hub-grid">{hubs.map(({icon:Icon,...hub})=><Link className={`saas-hub ${hub.color}`} href={hub.href} key={hub.href}><span className="saas-hub-icon"><Icon size={22}/></span><h3>{hub.title}</h3><p>{hub.description}</p><span className="saas-text-link">{hub.label}<ArrowUpRight size={16}/></span></Link>)}</div></section>
    <section className="saas-container"><div className="saas-research-banner"><div><span className="saas-eyebrow">GO FROM INTERESTING TO INSIGHTFUL</span><h2>See the bigger picture.</h2><p>Save companies worth watching. Compare them side by side.<br/>Connect the people, products and technologies behind them.</p><div className="saas-banner-actions"><Link href="/analytics" className="saas-primary">Explore analytics <ArrowRight size={16}/></Link><Link href="/graph" className="saas-text-link">Open the ecosystem graph <ArrowUpRight size={16}/></Link></div></div><div className="saas-research-steps"><Link href="/watchlist"><Bookmark size={20}/><span>Collect your inspiration<small>A watchlist that stays with you</small></span><Check size={15}/></Link><Link href="/compare"><GitCompareArrows size={20}/><span>Compare with clarity<small>Company details, side by side</small></span><ArrowUpRight size={15}/></Link><Link href="/trifecta"><Network size={20}/><span>Connect the opportunities<small>Business, code and product insights</small></span><ArrowUpRight size={15}/></Link></div></div></section>
    <section className="saas-container saas-faq"><LandingFaqAccordion/></section>
    <footer className="saas-footer saas-container"><Link href="/" className="saas-brand"><Layers size={22}/>Foundry.</Link><p>A little curiosity. A world of possibilities.</p><div><Link href="/yc">Explore</Link><Link href="/watchlist">Your watchlist</Link><Link href="/games">Take a break ↗</Link></div></footer>
  </div>;
}
