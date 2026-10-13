"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bookmark, ChevronDown, Layers, Menu, Moon, Sun, X } from "lucide-react";
import { moreNavLinks } from "./NavLinks";
import { useThemeStore } from "@/store/theme.store";
import { useCompareStore } from "@/store/compare.store";

const links = [
  { href: "/yc", label: "YC Startups" }, { href: "/githuboss", label: "Open Source" },
  { href: "/producthunt", label: "Products" }, { href: "/tech-news", label: "News" },
];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);
  const menu = useRef<HTMLDivElement>(null);
  const { resolved, setTheme } = useThemeStore();
  const count = useCompareStore((state) => state.selected.length);
  if (previousPath !== pathname) { setPreviousPath(pathname); setOpen(false); setMobile(false); }
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setMobile(false); } };
    document.addEventListener("pointerdown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);
  return <header className="saas-nav">
    <div className="saas-nav-inner">
      <Link href="/" className="saas-brand" aria-label="Foundry home"><span className="saas-brand-icon"><Layers size={20} strokeWidth={2.4} /></span>Foundry<span className="saas-brand-dot">.</span></Link>
      <nav className="saas-desktop-links" aria-label="Main navigation">
        {links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>{link.label}</Link>)}
        <div ref={menu} className="saas-more"><button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="research-menu">Resources <ChevronDown size={13} /></button>
          {open && <div id="research-menu" className="saas-dropdown">{[...moreNavLinks, { href: "/trifecta", label: "Trifecta", desc: "Connect business, code and products", icon: Layers }].map(({href,label,desc,icon:Icon}) => <Link href={href} key={href}><Icon size={17} /><span>{label}<small>{desc}</small></span></Link>)}</div>}
        </div>
      </nav>
      <div className="saas-nav-actions">
        {count > 0 && <Link href="/compare" className="saas-compare-link">Compare ({count})</Link>}
        <button className="saas-icon-button" aria-label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}>{resolved === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
        <Link href="/watchlist" className="saas-watchlist"><Bookmark size={15} /> Watchlist</Link>
        <Link href="/yc" className="saas-primary saas-nav-cta">Start exploring <ArrowUpRight size={15} /></Link>
        <button className="saas-mobile-toggle saas-icon-button" aria-label={mobile ? "Close navigation" : "Open navigation"} aria-expanded={mobile} aria-controls="mobile-navigation" onClick={() => setMobile(!mobile)}>{mobile ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </div>
    {mobile && <nav id="mobile-navigation" className="saas-mobile-links" aria-label="Mobile navigation">{[...links,...moreNavLinks,{href:"/trifecta",label:"Trifecta"},{href:"/compare",label:count ? `Compare (${count})` : "Compare"}].map(link=><Link key={link.href} href={link.href} onClick={() => setMobile(false)}>{link.label}<ArrowUpRight size={14}/></Link>)}</nav>}
  </header>;
}
