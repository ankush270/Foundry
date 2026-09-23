"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Focus,
  Sparkles,
  Route,
  Maximize2,
  Minimize2,
  Download,
  Building2,
  Users,
  Tag,
  MapPin,
  Zap,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Network
} from "lucide-react";
import * as d3 from "d3";
import { startups } from "@/data/startups";
import { GRAPH_NODE_COLORS, STATUS_HEX } from "@/lib/constants";
import BackLink from "@/components/ui/BackLink";
import PageHeader from "@/components/ui/PageHeader";

export interface GraphNodeDetails {
  oneLiner?: string;
  description?: string;
  logo?: string;
  batch?: string;
  status?: string;
  location?: string;
  country?: string;
  teamSize?: string;
  website?: string;
  founders?: { name: string; title: string; avatar?: string; linkedin?: string }[];
  industries?: string[];
  isHiring?: boolean;
  jobCount?: number;
  startupsCount?: number;
  startupsList?: { id: string; name: string; logo?: string; batch: string }[];
  coFounders?: string[];
  linkedStartup?: { id: string; name: string };
  founderAvatar?: string;
  founderTitle?: string;
  founderLinkedin?: string;
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "startup" | "industry" | "founder" | "batch";
  size: number;
  color: string;
  startupId?: string;
  details?: GraphNodeDetails;
  degree?: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  type: string;
}

function buildGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeMap = new Map<string, GraphNode>();

  const industryStartupsMap = new Map<string, { id: string; name: string; logo?: string; batch: string }[]>();
  const batchStartupsMap = new Map<string, { id: string; name: string; logo?: string; batch: string }[]>();

  // Pass 1: Gather mapping for industries and batches
  startups.forEach((s) => {
    const sItem = { id: s.id, name: s.name, logo: s.logo, batch: s.batch };
    s.industries.forEach((ind) => {
      if (!industryStartupsMap.has(ind)) industryStartupsMap.set(ind, []);
      industryStartupsMap.get(ind)!.push(sItem);
    });
    if (!batchStartupsMap.has(s.batch)) batchStartupsMap.set(s.batch, []);
    batchStartupsMap.get(s.batch)!.push(sItem);
  });

  // Pass 2: Build Nodes & Links
  startups.forEach((s) => {
    const sId = `s-${s.id}`;
    if (!nodeMap.has(sId)) {
      const startupNode: GraphNode = {
        id: sId,
        label: s.name,
        type: "startup",
        size: 11,
        color: GRAPH_NODE_COLORS.startup,
        startupId: s.id,
        details: {
          oneLiner: s.oneLiner,
          description: s.longDescription,
          logo: s.logo,
          batch: s.batch,
          status: s.status,
          location: s.location,
          country: s.country,
          teamSize: s.teamSize,
          website: s.website,
          founders: s.founders,
          industries: s.industries,
          isHiring: s.isHiring,
          jobCount: s.jobCount || s.jobs?.length || 0,
        },
      };
      nodeMap.set(sId, startupNode);
      nodes.push(startupNode);
    }

    // Industry connections
    s.industries.forEach((ind) => {
      const iId = `i-${ind}`;
      if (!nodeMap.has(iId)) {
        const indList = industryStartupsMap.get(ind) || [];
        const industryNode: GraphNode = {
          id: iId,
          label: ind,
          type: "industry",
          size: 15,
          color: GRAPH_NODE_COLORS.industry,
          details: {
            startupsCount: indList.length,
            startupsList: indList,
          },
        };
        nodeMap.set(iId, industryNode);
        nodes.push(industryNode);
      }
      links.push({ source: sId, target: iId, type: "industry" });
    });

    // Batch connections
    const bId = `b-${s.batch}`;
    if (!nodeMap.has(bId)) {
      const batchList = batchStartupsMap.get(s.batch) || [];
      const batchNode: GraphNode = {
        id: bId,
        label: s.batch,
        type: "batch",
        size: 9,
        color: GRAPH_NODE_COLORS.batch,
        details: {
          startupsCount: batchList.length,
          startupsList: batchList,
        },
      };
      nodeMap.set(bId, batchNode);
      nodes.push(batchNode);
    }
    links.push({ source: sId, target: bId, type: "batch" });

    // Founder connections
    s.founders.forEach((f) => {
      const fId = `f-${f.name.replace(/\s/g, "-")}`;
      const coFounders = s.founders.filter((other) => other.name !== f.name).map((other) => other.name);
      if (!nodeMap.has(fId)) {
        const founderNode: GraphNode = {
          id: fId,
          label: f.name,
          type: "founder",
          size: 8,
          color: GRAPH_NODE_COLORS.founder,
          details: {
            founderTitle: f.title,
            founderAvatar: f.avatar,
            founderLinkedin: f.linkedin,
            linkedStartup: { id: s.id, name: s.name },
            coFounders,
          },
        };
        nodeMap.set(fId, founderNode);
        nodes.push(founderNode);
      }
      links.push({ source: sId, target: fId, type: "founder" });
    });
  });

  // Calculate degree for each node
  const degreeMap = new Map<string, number>();
  links.forEach((l) => {
    const sId = typeof l.source === "string" ? l.source : (l.source as any).id;
    const tId = typeof l.target === "string" ? l.target : (l.target as any).id;
    degreeMap.set(sId, (degreeMap.get(sId) || 0) + 1);
    degreeMap.set(tId, (degreeMap.get(tId) || 0) + 1);
  });

  nodes.forEach((n) => {
    n.degree = degreeMap.get(n.id) || 0;
  });

  return { nodes, links };
}

// Pathfinder: Shortest path search (BFS)
function findShortestPath(
  nodes: GraphNode[],
  links: GraphLink[],
  startId: string,
  targetId: string
): { nodeIds: Set<string>; linkPairs: Set<string>; pathNodes: GraphNode[] } | null {
  if (!startId || !targetId || startId === targetId) return null;

  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));

  links.forEach((l) => {
    const sId = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
    const tId = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
    if (adj.has(sId) && adj.has(tId)) {
      adj.get(sId)!.push(tId);
      adj.get(tId)!.push(sId);
    }
  });

  const queue: string[] = [startId];
  const parent = new Map<string, string>();
  const visited = new Set<string>([startId]);

  let found = false;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === targetId) {
      found = true;
      break;
    }

    const neighbors = adj.get(curr) || [];
    for (const nxt of neighbors) {
      if (!visited.has(nxt)) {
        visited.add(nxt);
        parent.set(nxt, curr);
        queue.push(nxt);
      }
    }
  }

  if (!found) return null;

  const path: string[] = [];
  let curr: string | undefined = targetId;
  while (curr) {
    path.unshift(curr);
    curr = parent.get(curr);
  }

  const nodeIds = new Set(path);
  const linkPairs = new Set<string>();
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    linkPairs.add(`${a}---${b}`);
    linkPairs.add(`${b}---${a}`);
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const pathNodes = path.map((id) => nodeMap.get(id)!).filter(Boolean);

  return { nodeIds, linkPairs, pathNodes };
}

export default function GraphView() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [allGraphData] = useState(() => buildGraph());
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterBatch, setFilterBatch] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDropdown, setShowDropdown] = useState(false);

  // Advanced Visual Controls
  const [layoutMode, setLayoutMode] = useState<"force" | "cluster" | "radial">("force");
  const [sizeMode, setSizeMode] = useState<"default" | "degree">("degree");
  const [colorMode, setColorMode] = useState<"type" | "status">("type");

  // Pathfinder state
  const [isPathfinderActive, setIsPathfinderActive] = useState(false);
  const [pathSource, setPathSource] = useState<GraphNode | null>(null);
  const [pathTarget, setPathTarget] = useState<GraphNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const simRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null>(null);
  const linkSelectionRef = useRef<d3.Selection<SVGLineElement, GraphLink, SVGGElement, unknown> | null>(null);

  // Distinct list of batches for filter bar
  const availableBatches = useMemo(() => {
    const batches = new Set<string>();
    startups.forEach((s) => batches.add(s.batch));
    return Array.from(batches).sort();
  }, []);

  // Filtered dataset
  const filteredGraph = useMemo(() => {
    let { nodes, links } = allGraphData;

    // Filter by type
    if (filterType !== "all") {
      nodes = nodes.filter((n) => n.type === filterType);
    }

    // Filter by status if selected
    if (filterStatus !== "all") {
      nodes = nodes.filter((n) => {
        if (n.type === "startup") return n.details?.status === filterStatus;
        return true;
      });
    }

    // Filter by batch if selected
    if (filterBatch !== "all") {
      nodes = nodes.filter((n) => {
        if (n.type === "startup") return n.details?.batch === filterBatch;
        if (n.type === "batch") return n.label === filterBatch;
        return true;
      });
    }

    const nodeIds = new Set(nodes.map((n) => n.id));
    const filteredLinks = links.filter((l) => {
      const sId = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
      const tId = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
      return nodeIds.has(sId) && nodeIds.has(tId);
    });

    return { nodes, links: filteredLinks };
  }, [allGraphData, filterType, filterBatch, filterStatus]);

  // Compute Shortest Path
  const shortestPathResult = useMemo(() => {
    if (!isPathfinderActive || !pathSource || !pathTarget) return null;
    return findShortestPath(filteredGraph.nodes, filteredGraph.links, pathSource.id, pathTarget.id);
  }, [isPathfinderActive, pathSource, pathTarget, filteredGraph]);

  // Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return filteredGraph.nodes.filter(
      (n) => n.label.toLowerCase().includes(q) || n.type.toLowerCase().includes(q)
    );
  }, [searchQuery, filteredGraph]);

  // Network Analytics Insights
  const networkInsights = useMemo(() => {
    const topNode = [...filteredGraph.nodes].sort((a, b) => (b.degree || 0) - (a.degree || 0))[0];
    const topIndustry = filteredGraph.nodes
      .filter((n) => n.type === "industry")
      .sort((a, b) => (b.degree || 0) - (a.degree || 0))[0];
    return {
      totalNodes: filteredGraph.nodes.length,
      totalLinks: filteredGraph.links.length,
      topHub: topNode ? `${topNode.label} (${topNode.degree} links)` : "N/A",
      topIndustry: topIndustry ? `${topIndustry.label} (${topIndustry.degree} links)` : "N/A",
    };
  }, [filteredGraph]);

  // Direct Neighbor Nodes of Currently Selected Node
  const connectedNeighbors = useMemo(() => {
    if (!selectedNode) return [];
    const neighborIds = new Set<string>();

    allGraphData.links.forEach((l) => {
      const sId = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
      const tId = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
      if (sId === selectedNode.id) neighborIds.add(tId);
      if (tId === selectedNode.id) neighborIds.add(sId);
    });

    const nodeMap = new Map(allGraphData.nodes.map((n) => [n.id, n]));
    return Array.from(neighborIds)
      .map((id) => nodeMap.get(id)!)
      .filter(Boolean);
  }, [selectedNode, allGraphData]);

  // Camera Zoom to Node
  const zoomToNode = useCallback((targetNode: GraphNode) => {
    if (!svgRef.current || !zoomRef.current || !containerRef.current) return;
    if (targetNode.x == null || targetNode.y == null) return;

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth || 800;
    const height = isFullscreen ? window.innerHeight - 180 : 620;
    const scale = 2.2;
    const x = width / 2 - targetNode.x * scale;
    const y = height / 2 - targetNode.y * scale;

    svg.transition().duration(750).call(
      zoomRef.current.transform,
      d3.zoomIdentity.translate(x, y).scale(scale)
    );
  }, [isFullscreen]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
  };

  const handleSelectSearchResult = (node: GraphNode) => {
    setSelectedNode(node);
    if (isPathfinderActive) {
      if (!pathSource) setPathSource(node);
      else if (!pathTarget && node.id !== pathSource.id) setPathTarget(node);
    }
    zoomToNode(node);
    setShowDropdown(false);
  };

  const handleSurpriseMe = () => {
    const candidates = filteredGraph.nodes.filter((n) => n.type === "startup" || n.type === "founder");
    if (candidates.length === 0) return;
    const randomNode = candidates[Math.floor(Math.random() * candidates.length)];
    setSelectedNode(randomNode);
    zoomToNode(randomNode);
  };

  const handleExportPNG = () => {
    if (!svgRef.current || !containerRef.current) return;
    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = containerRef.current?.clientWidth || 1200;
      canvas.height = 620;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#090d16";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        const pngURL = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngURL;
        downloadLink.download = `startup-dna-graph-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  const getNodeColor = useCallback(
    (d: GraphNode) => {
      if (colorMode === "status" && d.type === "startup" && d.details?.status) {
        return STATUS_HEX[d.details.status] || GRAPH_NODE_COLORS.startup;
      }
      return d.color;
    },
    [colorMode]
  );

  const getNodeRadius = useCallback(
    (d: GraphNode) => {
      if (sizeMode === "degree") {
        const deg = d.degree || 1;
        return Math.max(7, Math.min(22, 6 + deg * 2.2));
      }
      return d.size;
    },
    [sizeMode]
  );

  // Build / Re-build D3 Force Graph when data, filter, or layout changes
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = isFullscreen ? window.innerHeight - 180 : 620;
    const { nodes, links } = filteredGraph;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);
    zoomRef.current = zoom;

    // Layout configuration forces
    const linkForce = d3
      .forceLink<GraphNode, GraphLink>(links)
      .id((d) => d.id)
      .distance(layoutMode === "cluster" ? 60 : 85);

    const sim = d3.forceSimulation<GraphNode>(nodes).force("link", linkForce);

    if (layoutMode === "cluster") {
      // Group around Industry centers
      const industries = Array.from(new Set(nodes.filter((n) => n.type === "industry").map((n) => n.id)));
      const angleStep = (2 * Math.PI) / Math.max(1, industries.length);
      const radius = Math.min(width, height) * 0.35;
      const centers = new Map<string, { x: number; y: number }>();

      industries.forEach((indId, idx) => {
        centers.set(indId, {
          x: width / 2 + radius * Math.cos(idx * angleStep),
          y: height / 2 + radius * Math.sin(idx * angleStep),
        });
      });

      sim
        .force("charge", d3.forceManyBody().strength(-120))
        .force("x", d3.forceX((d: any) => {
          const node = d as GraphNode;
          if (node.type === "industry" && centers.has(node.id)) return centers.get(node.id)!.x;
          return width / 2;
        }).strength(0.2))
        .force("y", d3.forceY((d: any) => {
          const node = d as GraphNode;
          if (node.type === "industry" && centers.has(node.id)) return centers.get(node.id)!.y;
          return height / 2;
        }).strength(0.2));
    } else if (layoutMode === "radial") {
      // Organize in radial orbits by type
      const typeRadius: Record<string, number> = {
        industry: 80,
        startup: 200,
        founder: 310,
        batch: 390,
      };
      sim
        .force("charge", d3.forceManyBody().strength(-180))
        .force("r", d3.forceRadial((d: any) => typeRadius[(d as GraphNode).type] || 200, width / 2, height / 2).strength(0.8));
    } else {
      // Default organic force
      sim
        .force("charge", d3.forceManyBody().strength(-220))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius((d: any) => getNodeRadius(d as GraphNode) + 6));
    }

    simRef.current = sim;

    const linkSelection = g
      .append("g")
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(links)
      .join("line")
      .attr("stroke", "var(--border-color)")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.3);

    linkSelectionRef.current = linkSelection;

    const dragBehavior = d3
      .drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeSelection = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", "graph-node cursor-pointer")
      .call(dragBehavior);

    nodeSelection
      .append("circle")
      .attr("r", (d) => getNodeRadius(d))
      .attr("fill", (d) => getNodeColor(d))
      .attr("stroke", "var(--background)")
      .attr("stroke-width", 2)
      .attr("opacity", 0.9);

    nodeSelection
      .append("text")
      .text((d) => (d.label.length > 15 ? d.label.slice(0, 15) + "…" : d.label))
      .attr("dy", (d) => getNodeRadius(d) + 14)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--muted)")
      .attr("font-size", "9px")
      .attr("font-weight", "500")
      .attr("pointer-events", "none");

    // Mouse interactions
    nodeSelection
      .on("mouseover", function (event, d) {
        d3.select(this).select("circle").transition().duration(200).attr("r", getNodeRadius(d) * 1.4);
        linkSelection
          .attr("stroke-opacity", (l: any) => {
            const sId = typeof l.source === "object" ? l.source.id : l.source;
            const tId = typeof l.target === "object" ? l.target.id : l.target;
            return sId === d.id || tId === d.id ? 0.85 : 0.08;
          })
          .attr("stroke-width", (l: any) => {
            const sId = typeof l.source === "object" ? l.source.id : l.source;
            const tId = typeof l.target === "object" ? l.target.id : l.target;
            return sId === d.id || tId === d.id ? 2.5 : 1;
          })
          .attr("stroke", (l: any) => {
            const sId = typeof l.source === "object" ? l.source.id : l.source;
            const tId = typeof l.target === "object" ? l.target.id : l.target;
            return sId === d.id || tId === d.id ? getNodeColor(d) : "var(--border-color)";
          });
      })
      .on("mouseout", function (event, d) {
        d3.select(this).select("circle").transition().duration(200).attr("r", getNodeRadius(d));
        if (!shortestPathResult) {
          linkSelection
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 1)
            .attr("stroke", "var(--border-color)");
        }
      })
      .on("click", (event, d) => {
        setSelectedNode(d);
        if (isPathfinderActive) {
          if (!pathSource) setPathSource(d);
          else if (!pathTarget && d.id !== pathSource.id) setPathTarget(d);
        }
        zoomToNode(d);
      });

    nodeSelectionRef.current = nodeSelection;

    sim.on("tick", () => {
      linkSelection
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      nodeSelection.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      sim.stop();
    };
  }, [filteredGraph, layoutMode, sizeMode, colorMode, getNodeColor, getNodeRadius, zoomToNode, isFullscreen]);

  // Pathfinder dynamic SVG styling
  useEffect(() => {
    if (!nodeSelectionRef.current || !linkSelectionRef.current) return;
    const nodeSel = nodeSelectionRef.current;
    const linkSel = linkSelectionRef.current;

    if (shortestPathResult) {
      const { nodeIds, linkPairs } = shortestPathResult;

      nodeSel
        .select("circle")
        .transition()
        .duration(300)
        .attr("opacity", (d: GraphNode) => (nodeIds.has(d.id) ? 1 : 0.12))
        .attr("stroke", (d: GraphNode) => (nodeIds.has(d.id) ? "#ec4899" : "var(--background)"))
        .attr("stroke-width", (d: GraphNode) => (nodeIds.has(d.id) ? 3.5 : 1))
        .attr("r", (d: GraphNode) => (nodeIds.has(d.id) ? getNodeRadius(d) * 1.3 : getNodeRadius(d)));

      nodeSel
        .select("text")
        .transition()
        .duration(300)
        .attr("opacity", (d: GraphNode) => (nodeIds.has(d.id) ? 1 : 0.12))
        .attr("font-weight", (d: GraphNode) => (nodeIds.has(d.id) ? "700" : "500"))
        .attr("fill", (d: GraphNode) => (nodeIds.has(d.id) ? "var(--foreground)" : "var(--muted)"));

      linkSel
        .transition()
        .duration(300)
        .attr("stroke-opacity", (l: any) => {
          const sId = typeof l.source === "object" ? l.source.id : l.source;
          const tId = typeof l.target === "object" ? l.target.id : l.target;
          return linkPairs.has(`${sId}---${tId}`) ? 1 : 0.05;
        })
        .attr("stroke-width", (l: any) => {
          const sId = typeof l.source === "object" ? l.source.id : l.source;
          const tId = typeof l.target === "object" ? l.target.id : l.target;
          return linkPairs.has(`${sId}---${tId}`) ? 3.5 : 0.5;
        })
        .attr("stroke", (l: any) => {
          const sId = typeof l.source === "object" ? l.source.id : l.source;
          const tId = typeof l.target === "object" ? l.target.id : l.target;
          return linkPairs.has(`${sId}---${tId}`) ? "#ec4899" : "var(--border-color)";
        });
      return;
    }

    // Search input highlight logic
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      nodeSel
        .select("circle")
        .transition()
        .duration(200)
        .attr("opacity", 0.9)
        .attr("stroke", "var(--background)")
        .attr("stroke-width", 2)
        .attr("r", (d: GraphNode) => getNodeRadius(d));

      nodeSel
        .select("text")
        .transition()
        .duration(200)
        .attr("opacity", 1)
        .attr("font-weight", "500")
        .attr("fill", "var(--muted)");

      linkSel
        .transition()
        .duration(200)
        .attr("stroke-opacity", 0.3)
        .attr("stroke-width", 1)
        .attr("stroke", "var(--border-color)");
      return;
    }

    const matchingIds = new Set(searchResults.map((n) => n.id));

    nodeSel
      .select("circle")
      .transition()
      .duration(200)
      .attr("opacity", (d: GraphNode) => (matchingIds.has(d.id) ? 1 : 0.15))
      .attr("stroke", (d: GraphNode) => (matchingIds.has(d.id) ? "#6366f1" : "var(--background)"))
      .attr("stroke-width", (d: GraphNode) => (matchingIds.has(d.id) ? 3 : 1))
      .attr("r", (d: GraphNode) => (matchingIds.has(d.id) ? getNodeRadius(d) * 1.4 : getNodeRadius(d)));

    nodeSel
      .select("text")
      .transition()
      .duration(200)
      .attr("opacity", (d: GraphNode) => (matchingIds.has(d.id) ? 1 : 0.15))
      .attr("font-weight", (d: GraphNode) => (matchingIds.has(d.id) ? "700" : "500"))
      .attr("fill", (d: GraphNode) => (matchingIds.has(d.id) ? "var(--foreground)" : "var(--muted)"));

    linkSel
      .transition()
      .duration(200)
      .attr("stroke-opacity", (l: any) => {
        const sId = typeof l.source === "object" ? l.source.id : l.source;
        const tId = typeof l.target === "object" ? l.target.id : l.target;
        return matchingIds.has(sId) || matchingIds.has(tId) ? 0.7 : 0.05;
      })
      .attr("stroke-width", (l: any) => {
        const sId = typeof l.source === "object" ? l.source.id : l.source;
        const tId = typeof l.target === "object" ? l.target.id : l.target;
        return matchingIds.has(sId) || matchingIds.has(tId) ? 2 : 0.5;
      });
  }, [searchQuery, searchResults, shortestPathResult, getNodeRadius]);

  const legendItems = [
    { type: "startup", label: "Startup", color: GRAPH_NODE_COLORS.startup },
    { type: "industry", label: "Industry", color: GRAPH_NODE_COLORS.industry },
    { type: "founder", label: "Founder", color: GRAPH_NODE_COLORS.founder },
    { type: "batch", label: "Batch", color: GRAPH_NODE_COLORS.batch },
  ];

  return (
    <div className={`min-h-screen ${isFullscreen ? "fixed inset-0 z-50 bg-[var(--background)] p-4 overflow-y-auto" : ""}`}>
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-br from-pink-500/5 via-transparent to-[var(--accent)]/5 -z-10" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4 pb-16">
        {!isFullscreen && (
          <>
            <BackLink />
            <PageHeader
              title="Startup DNA Graph"
              subtitle="Interactive network analyzer for YC startups, industries, founders, and batches"
            />
          </>
        )}

        {/* Network Ecosystem Analytics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] flex items-center gap-3 shadow-sm">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Nodes & Links</div>
              <div className="text-sm font-extrabold text-[var(--foreground)]">
                {networkInsights.totalNodes} Nodes • {networkInsights.totalLinks} Links
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] flex items-center gap-3 shadow-sm">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Top Network Hub</div>
              <div className="text-sm font-extrabold text-[var(--foreground)] truncate">{networkInsights.topHub}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] flex items-center gap-3 shadow-sm">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Top Industry Cluster</div>
              <div className="text-sm font-extrabold text-[var(--foreground)] truncate">{networkInsights.topIndustry}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSurpriseMe}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer"
                title="Randomly pick and focus on a node"
              >
                <Sparkles className="w-3.5 h-3.5" /> Surprise Me
              </button>
            </div>
            <button
              onClick={() => setIsPathfinderActive(!isPathfinderActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isPathfinderActive
                  ? "bg-pink-500/20 border-pink-500 text-pink-400 shadow-md ring-1 ring-pink-500/40"
                  : "border-[var(--border-color)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Route className="w-3.5 h-3.5" /> Pathfinder
            </button>
          </div>
        </motion.div>

        {/* Pathfinder Connection Tracer Banner */}
        <AnimatePresence>
          {isPathfinderActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 shadow-lg backdrop-blur-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 font-bold">
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[var(--foreground)]">Pathfinder Connection Tracer</h4>
                    <p className="text-xs text-[var(--muted)]">
                      Find the shortest connection path between any two startups, founders, or industries in the YC DNA graph.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Source Node Selector */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-xs">
                    <span className="text-[10px] font-bold text-pink-400 uppercase">From:</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {pathSource ? pathSource.label : "Click any node"}
                    </span>
                    {pathSource && (
                      <button onClick={() => setPathSource(null)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <ArrowRight className="w-4 h-4 text-pink-400 shrink-0" />

                  {/* Target Node Selector */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-xs">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">To:</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {pathTarget ? pathTarget.label : "Click 2nd node"}
                    </span>
                    {pathTarget && (
                      <button onClick={() => setPathTarget(null)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {(pathSource || pathTarget) && (
                    <button
                      onClick={() => {
                        setPathSource(null);
                        setPathTarget(null);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/10"
                    >
                      Clear Path
                    </button>
                  )}
                </div>
              </div>

              {/* Shortest Path Results Timeline */}
              {shortestPathResult && (
                <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-pink-400 shrink-0 mr-2">
                    Path ({shortestPathResult.pathNodes.length - 1} Hops):
                  </span>
                  {shortestPathResult.pathNodes.map((node, idx) => (
                    <div key={node.id} className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedNode(node);
                          zoomToNode(node);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--surface)] border border-pink-500/40 hover:border-pink-500 text-xs font-semibold text-[var(--foreground)] transition-all shadow-sm group"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: node.color }} />
                        <span>{node.label}</span>
                        <span className="text-[9px] uppercase font-mono text-[var(--muted)]">({node.type})</span>
                      </button>
                      {idx < shortestPathResult.pathNodes.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter and Visual Controls Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6 z-20 relative"
        >
          <div className="flex flex-wrap items-center gap-3 relative">
            {/* Search Input Box */}
            <div className="relative">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] focus-within:border-indigo-500 transition-all shadow-sm w-64 sm:w-72">
                <Search className="w-4 h-4 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search nodes (e.g. Airbnb, Tony)..."
                  className="bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/60 outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="p-0.5 rounded-md hover:bg-white/10 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Instant Search Suggestions Dropdown */}
              <AnimatePresence>
                {showDropdown && searchQuery.trim() !== "" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    data-lenis-prevent
                    className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto backdrop-blur-lg"
                  >
                    <div className="px-3 py-2 text-[11px] font-semibold text-[var(--muted)] border-b border-[var(--border-color)] flex items-center justify-between">
                      <span>{searchResults.length} matching nodes found</span>
                      <span className="text-[10px] text-indigo-400 font-mono">Click to focus</span>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[var(--muted)]">
                        No nodes found matching &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      searchResults.slice(0, 12).map((node) => (
                        <button
                          key={node.id}
                          onClick={() => handleSelectSearchResult(node)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-500/10 flex items-center justify-between text-xs transition-colors border-b border-[var(--border-color)]/30 last:border-0 group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: node.color }}
                            />
                            <span className="font-semibold text-[var(--foreground)] group-hover:text-indigo-500 truncate">
                              {node.label}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--muted)] shrink-0 ml-2">
                            {node.type}
                          </span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Type Pills */}
            <div className="flex gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
              {["all", "startup", "industry", "founder", "batch"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterType === t
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Filter by Batch Dropdown */}
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--foreground)] outline-none focus:border-indigo-500"
            >
              <option value="all">All Batches</option>
              {availableBatches.map((b) => (
                <option key={b} value={b}>
                  Batch {b}
                </option>
              ))}
            </select>

            {/* Filter by Status Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--foreground)] outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Public">Public</option>
              <option value="Acquired">Acquired</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Layout Dynamics & Visual Mode Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Layout Mode Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-xs">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase px-2">Layout:</span>
              <button
                onClick={() => setLayoutMode("force")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  layoutMode === "force" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Physics Organic Force"
              >
                Organic
              </button>
              <button
                onClick={() => setLayoutMode("cluster")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  layoutMode === "cluster" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Group by Industry Clusters"
              >
                Clusters
              </button>
              <button
                onClick={() => setLayoutMode("radial")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  layoutMode === "radial" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Radial Orbit Layout"
              >
                Radial
              </button>
            </div>

            {/* Sizing Mode Toggle */}
            <button
              onClick={() => setSizeMode(sizeMode === "default" ? "degree" : "default")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                sizeMode === "degree"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 font-bold"
                  : "border-[var(--border-color)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              title="Size nodes by degree (connection count)"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Node Sizing: {sizeMode === "degree" ? "Degree" : "Uniform"}
            </button>

            {/* Color Mode Toggle */}
            <button
              onClick={() => setColorMode(colorMode === "type" ? "status" : "type")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                colorMode === "status"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 font-bold"
                  : "border-[var(--border-color)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              title="Color nodes by startup status vs type"
            >
              <Tag className="w-3.5 h-3.5" /> Color By: {colorMode === "status" ? "Status" : "Type"}
            </button>
          </div>
        </motion.div>

        {/* Node Color Legend (Interactive Filter Buttons) */}
        <div className="flex items-center gap-2 mb-4">
          {legendItems.map((item) => {
            const active = filterType === item.type;
            return (
              <button
                key={item.label}
                onClick={() => setFilterType(active ? "all" : item.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  active
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 font-bold shadow-md ring-1 ring-indigo-500/50"
                    : "border-[var(--border-color)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted)]/40"
                }`}
                title={`Click to filter ${item.label} nodes`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-transform ${active ? "scale-125 ring-2 ring-white/20" : ""}`}
                  style={{ background: item.color }}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Graph Display Canvas Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          ref={containerRef}
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] overflow-hidden relative shadow-xl"
        >
          <svg ref={svgRef} className="w-full" style={{ minHeight: isFullscreen ? "calc(100vh - 200px)" : 620 }} />

          {/* Floating Canvas Action Bar (Zoom, Fullscreen, Export) */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-[var(--surface)]/90 border border-[var(--border-color)] p-1.5 rounded-xl shadow-lg backdrop-blur-md z-10">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="h-px bg-[var(--border-color)] my-0.5" />
            <button
              onClick={handleExportPNG}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title="Download Graph Image (PNG)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Expanded Selected Node Deep Info Drawer */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                data-lenis-prevent
                className="absolute top-4 right-4 w-80 sm:w-96 max-h-[calc(100%-2rem)] p-5 rounded-2xl bg-[var(--surface)]/95 border border-[var(--border-color)] shadow-2xl backdrop-blur-xl z-20 overflow-y-auto"
              >
                {/* Header Badge & Close Button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md"
                      style={{
                        color: selectedNode.color,
                        backgroundColor: `${selectedNode.color}20`,
                      }}
                    >
                      {selectedNode.type}
                    </span>
                    {selectedNode.degree !== undefined && (
                      <span className="text-[10px] font-semibold text-[var(--muted)] bg-white/5 px-2 py-0.5 rounded-md">
                        {selectedNode.degree} Connections
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-[var(--muted)] hover:text-[var(--foreground)] p-1 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Node Title & Logo */}
                <div className="flex items-start gap-3 mb-3">
                  {selectedNode.type === "startup" && selectedNode.details?.logo ? (
                    <img
                      src={selectedNode.details.logo}
                      alt={selectedNode.label}
                      className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-[var(--border-color)] shrink-0"
                    />
                  ) : selectedNode.type === "founder" && selectedNode.details?.founderAvatar ? (
                    <img
                      src={selectedNode.details.founderAvatar}
                      alt={selectedNode.label}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)] shrink-0"
                    />
                  ) : null}
                  <div>
                    <h3 className="font-extrabold text-lg text-[var(--foreground)] leading-tight">
                      {selectedNode.label}
                    </h3>
                    {selectedNode.type === "founder" && selectedNode.details?.founderTitle && (
                      <p className="text-xs font-semibold text-[var(--muted)] mt-0.5">
                        {selectedNode.details.founderTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Startup Specific Details */}
                {selectedNode.type === "startup" && selectedNode.details && (
                  <div className="space-y-3">
                    {selectedNode.details.oneLiner && (
                      <p className="text-xs text-[var(--foreground)]/90 leading-relaxed font-medium">
                        {selectedNode.details.oneLiner}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {selectedNode.details.batch && (
                        <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                          Batch {selectedNode.details.batch}
                        </span>
                      )}
                      {selectedNode.details.status && (
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          {selectedNode.details.status}
                        </span>
                      )}
                      {selectedNode.details.teamSize && (
                        <span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {selectedNode.details.teamSize} team
                        </span>
                      )}
                      {selectedNode.details.isHiring && (
                        <span className="px-2 py-1 rounded-lg bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30">
                          🔥 Hiring ({selectedNode.details.jobCount} jobs)
                        </span>
                      )}
                    </div>

                    {selectedNode.details.location && (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{selectedNode.details.location}, {selectedNode.details.country}</span>
                      </div>
                    )}

                    {selectedNode.details.founders && selectedNode.details.founders.length > 0 && (
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="text-[11px] font-bold text-[var(--muted)] uppercase mb-1.5">Founders</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.details.founders.map((f) => (
                            <span key={f.name} className="text-xs font-semibold text-[var(--foreground)] bg-white/5 px-2 py-1 rounded-lg border border-[var(--border-color)]">
                              {f.name} ({f.title})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Industry Specific Details */}
                {selectedNode.type === "industry" && selectedNode.details && (
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--muted)] font-medium">
                      Industry Cluster with <strong className="text-[var(--foreground)]">{selectedNode.details.startupsCount} YC startups</strong> in this graph dataset.
                    </p>
                    {selectedNode.details.startupsList && (
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2">Startups in {selectedNode.label}</div>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                          {selectedNode.details.startupsList.map((sItem) => (
                            <button
                              key={sItem.id}
                              onClick={() => {
                                const targetN = allGraphData.nodes.find((n) => n.id === `s-${sItem.id}`);
                                if (targetN) {
                                  setSelectedNode(targetN);
                                  zoomToNode(targetN);
                                }
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-white/5 border border-[var(--border-color)]/50 flex items-center justify-between text-xs transition-colors group"
                            >
                              <span className="font-bold text-[var(--foreground)] group-hover:text-indigo-400">{sItem.name}</span>
                              <span className="text-[10px] text-amber-400 font-mono">Batch {sItem.batch}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Founder Specific Details */}
                {selectedNode.type === "founder" && selectedNode.details && (
                  <div className="space-y-3">
                    {selectedNode.details.linkedStartup && (
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Associated Startup</span>
                        <button
                          onClick={() => {
                            const targetN = allGraphData.nodes.find((n) => n.id === `s-${selectedNode.details?.linkedStartup?.id}`);
                            if (targetN) {
                              setSelectedNode(targetN);
                              zoomToNode(targetN);
                            }
                          }}
                          className="font-extrabold text-sm text-[var(--foreground)] hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                        >
                          {selectedNode.details.linkedStartup.name} <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {selectedNode.details.coFounders && selectedNode.details.coFounders.length > 0 && (
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="text-[11px] font-bold text-[var(--muted)] uppercase mb-1.5">Co-Founders</div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNode.details.coFounders.map((cf) => (
                            <span key={cf} className="text-xs font-semibold text-[var(--foreground)] bg-white/5 px-2.5 py-1 rounded-lg">
                              {cf}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Batch Specific Details */}
                {selectedNode.type === "batch" && selectedNode.details && (
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--muted)] font-medium">
                      YC Batch <strong className="text-amber-400">{selectedNode.label}</strong> with {selectedNode.details.startupsCount} startups in graph.
                    </p>
                    {selectedNode.details.startupsList && (
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2">Batch Companies</div>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                          {selectedNode.details.startupsList.map((sItem) => (
                            <button
                              key={sItem.id}
                              onClick={() => {
                                const targetN = allGraphData.nodes.find((n) => n.id === `s-${sItem.id}`);
                                if (targetN) {
                                  setSelectedNode(targetN);
                                  zoomToNode(targetN);
                                }
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-white/5 border border-[var(--border-color)]/50 flex items-center justify-between text-xs transition-colors group"
                            >
                              <span className="font-bold text-[var(--foreground)] group-hover:text-indigo-400">{sItem.name}</span>
                              <span className="text-[10px] text-[var(--muted)]">View Profile →</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Connected Neighbors Direct Quick Navigation */}
                {connectedNeighbors.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                    <div className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2 flex items-center justify-between">
                      <span>Connected Network ({connectedNeighbors.length})</span>
                      <span className="text-[10px] text-indigo-400 font-mono">1-Hop Jump</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {connectedNeighbors.map((nb) => (
                        <button
                          key={nb.id}
                          onClick={() => {
                            setSelectedNode(nb);
                            zoomToNode(nb);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/10 border border-[var(--border-color)] text-[11px] font-semibold text-[var(--foreground)] hover:text-indigo-400 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: nb.color }} />
                          <span className="truncate max-w-[120px]">{nb.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-[var(--border-color)]">
                  <button
                    onClick={() => zoomToNode(selectedNode)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-bold transition-colors"
                  >
                    <Focus className="w-3.5 h-3.5" /> Center Camera
                  </button>

                  {isPathfinderActive && (
                    <button
                      onClick={() => {
                        if (!pathSource) setPathSource(selectedNode);
                        else if (!pathTarget && selectedNode.id !== pathSource.id) setPathTarget(selectedNode);
                      }}
                      className="py-2 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 text-xs font-bold transition-colors"
                      title="Set as Pathfinder node"
                    >
                      Set Pathfinder
                    </button>
                  )}

                  {selectedNode.type === "startup" && selectedNode.startupId && (
                    <Link
                      href={`/startup/${selectedNode.startupId}`}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
                    >
                      Full Details →
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
