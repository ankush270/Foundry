"use client";
import {useEffect, useState} from "react";
import {GithubService} from "@/services/github";
import {useRefreshTick} from "@/hooks/useRefreshTick";
import type {DomainCategory, OssRepository} from "../types";
export function LaunchRadar({onSelectDomain}:{onSelectDomain:(domain:DomainCategory)=>void}) {
  const tick=useRefreshTick();
  const [repos,setRepos]=useState<OssRepository[]>([]);
  const [status,setStatus]=useState("Loading live repository activity…");
  useEffect(()=>{
    let active=true;
    void GithubService.fetchLiveRepositories({sortBy:"updated",perPage:9,discoveryMode:"trending"}).then(result=>{
      if(!active)return;
      setRepos(result.repos);
      setStatus(result.isLive?`GitHub checked ${new Date().toLocaleString()}`:"Live GitHub unavailable. Retry shortly.");
    });
    return()=>{active=false;};
  },[tick]);
  return <section className="space-y-5">
    <h2 className="text-2xl font-bold">Recently updated repositories</h2>
    <p className="text-sm text-[var(--muted)]">Sorted by repository update time, not measured star growth. Push notifications are not enabled.</p>
    <p role="status" className="text-sm">{status}</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{repos.map(repo=><article key={repo.id} className="doodle-card p-5 space-y-3">
      <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer" className="font-bold break-words">{repo.fullName} ↗</a>
      <p className="text-sm text-[var(--muted)]">{repo.description}</p>
      <p className="text-sm">{repo.stars.toLocaleString()} stars · {repo.language}</p>
      <button className="doodle-btn px-3 py-2 text-sm" onClick={()=>onSelectDomain(repo.domainCategory)}>Explore related domain</button>
    </article>)}</div>
  </section>;
}
