"use client";
import {useEffect} from "react";
import {create} from "zustand";
import {GithubService} from "@/services/github";
import {ProductHuntApiService} from "@/services/producthunt/producthunt-api.service";
import type {OssRepository} from "@/modules/githuboss/types";
import type {ProductHuntProduct} from "@/modules/producthunt/types";
const useResearch=create<{repos:OssRepository[]; products:ProductHuntProduct[]; checkedAt:number; loading:boolean}>(()=>({repos:[],products:[],checkedAt:0,loading:false}));
async function refresh() {
  const state=useResearch.getState();
  if (document.hidden || state.loading || Date.now()-state.checkedAt<300000) return;
  useResearch.setState({loading:true});
  const [gh,ph]=await Promise.allSettled([GithubService.fetchLiveRepositories({perPage:60}),ProductHuntApiService.fetchProducts({limit:50})]);
  useResearch.setState({repos:gh.status==="fulfilled"&&gh.value.isLive?gh.value.repos:[],products:ph.status==="fulfilled"&&ph.value.isLive?ph.value.products:[],checkedAt:Date.now(),loading:false});
}
export function useLiveResearch(enabled=true) {
  const state=useResearch();
  useEffect(()=>{
    if (!enabled) return;
    void refresh();
    const timer=setInterval(refresh,300000);
    document.addEventListener("visibilitychange",refresh);
    return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",refresh);};
  },[enabled]);
  return state;
}
