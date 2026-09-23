"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import type { Startup } from "@/data/types";

export function useFuzzySearch(items: Startup[], query: string) {
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: "name", weight: 3 },
        { name: "oneLiner", weight: 2 },
        { name: "industries", weight: 2 },
        { name: "founders.name", weight: 1.5 },
        { name: "tags", weight: 1 },
        { name: "location", weight: 0.5 },
        { name: "batch", weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 1,
    });
  }, [items]);

  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return items;
    return fuse.search(trimmed).map((r) => r.item);
  }, [fuse, items, query]);
}

