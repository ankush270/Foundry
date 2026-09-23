"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X,
  Sparkles,
  ExternalLink,
  ChevronUp,
  Globe,
  Code2,
  Flame,
  Award,
  Layers,
  Users,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Network,
  List,
  Cpu,
  Share2,
  Check,
  ArrowRight,
  TrendingUp,
  Info,
  Maximize2,
  Compass,
} from "lucide-react";
import * as d3 from "d3";
import type { ProductMaker, ProductHuntProduct } from "../types";
import { SAMPLE_PRODUCTHUNT_PRODUCTS } from "@/data/producthunt-products";

interface MakerPortfolioModalProps {
  maker: ProductMaker | null;
  currentProduct?: ProductHuntProduct | null;
  onClose: () => void;
  onSelectProduct?: (product: ProductHuntProduct) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "maker" | "product" | "tech" | "badge";
  subtitle?: string;
  val: number;
  color: string;
  productRef?: ProductHuntProduct;
  upvotes?: number;
  productId?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  relationship: string;
}

export default function MakerPortfolioModal({
  maker,
  currentProduct,
  onClose,
  onSelectProduct,
}: MakerPortfolioModalProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "list" | "tech">("graph");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [layoutMode, setLayoutMode] = useState<"orbit" | "force">("orbit");
  const [copied, setCopied] = useState(false);

  // SVG & Graph State
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Find all products by this maker from catalog
  const makerProducts = useMemo(() => {
    if (!maker) return [];

    const matches = SAMPLE_PRODUCTHUNT_PRODUCTS.filter((p) =>
      p.makers.some(
        (m) =>
          m.name.toLowerCase() === maker.name.toLowerCase() ||
          (m.username && maker.username && m.username.toLowerCase() === maker.username.toLowerCase())
      )
    );

    if (currentProduct && !matches.some((p) => p.id === currentProduct.id)) {
      matches.unshift(currentProduct);
    }

    return matches;
  }, [maker, currentProduct]);

  // Total metrics
  const totalUpvotes = useMemo(() => {
    return makerProducts.reduce((acc, p) => acc + p.votesCount, 0);
  }, [makerProducts]);

  const allTechStack = useMemo(() => {
    const set = new Set<string>();
    makerProducts.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [makerProducts]);

  // Construct D3 Graph Nodes & Links
  const { nodes, links } = useMemo(() => {
    if (!maker) return { nodes: [], links: [] };

    const nodeArr: GraphNode[] = [];
    const linkArr: GraphLink[] = [];

    // Central Maker Node
    const makerNodeId = `maker-${maker.username || maker.name}`;
    nodeArr.push({
      id: makerNodeId,
      label: maker.name,
      type: "maker",
      subtitle: maker.headline || "Product Maker",
      val: 32,
      color: "#f43f5e", // Rose 500
    });

    // Product Nodes
    makerProducts.forEach((prod) => {
      const prodNodeId = `prod-${prod.id}`;
      nodeArr.push({
        id: prodNodeId,
        label: prod.name,
        type: "product",
        subtitle: `${prod.category}`,
        val: 24,
        color: "#6366f1", // Indigo 500
        productRef: prod,
        upvotes: prod.votesCount,
        productId: prod.id,
      });

      // Link Maker -> Product
      linkArr.push({
        source: makerNodeId,
        target: prodNodeId,
        relationship: "Created",
      });

      // Tech Nodes attached directly to specific product (per-product tech nodes to avoid spider web overlap)
      prod.techStack.slice(0, 3).forEach((tech) => {
        const techNodeId = `tech-${prod.id}-${tech.toLowerCase().replace(/\s+/g, "-")}`;
        nodeArr.push({
          id: techNodeId,
          label: tech,
          type: "tech",
          subtitle: "Tech Stack",
          val: 14,
          color: "#10b981", // Emerald 500
          productId: prod.id,
        });

        linkArr.push({
          source: prodNodeId,
          target: techNodeId,
          relationship: "Built With",
        });
      });

      // Badges / Awards Node
      if (prod.badge || prod.ycBatch) {
        const badgeLabel = prod.badge || `YC ${prod.ycBatch}`;
        const badgeNodeId = `badge-${prod.id}`;
        nodeArr.push({
          id: badgeNodeId,
          label: badgeLabel,
          type: "badge",
          subtitle: "Award",
          val: 16,
          color: "#f59e0b", // Amber 500
          productId: prod.id,
        });

        linkArr.push({
          source: prodNodeId,
          target: badgeNodeId,
          relationship: "Awarded",
        });
      }
    });

    return { nodes: nodeArr, links: linkArr };
  }, [maker, makerProducts]);

  // Render D3 Interactive Force Graph with Clean Pill Badges & High Contrast
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0 || activeTab !== "graph") return;

    const width = svgRef.current.clientWidth || 900;
    const height = svgRef.current.clientHeight || 560;

    // Clear previous elements
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Container Group for Zoom/Pan
    const container = svg.append("g").attr("class", "graph-container");

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Deep Clone Nodes & Links
    const simNodes: GraphNode[] = nodes.map((d) => ({ ...d }));
    const simLinks: GraphLink[] = links.map((d) => ({ ...d }));

    const centerX = width / 2;
    const centerY = height / 2;

    // Initial positioning for Orbit Mode
    const makerNode = simNodes.find((n) => n.type === "maker");
    if (makerNode) {
      makerNode.fx = centerX;
      makerNode.fy = centerY;
    }

    if (layoutMode === "orbit") {
      const productNodes = simNodes.filter((n) => n.type === "product");
      const numProducts = productNodes.length;

      productNodes.forEach((p, idx) => {
        const angle = (idx / numProducts) * 2 * Math.PI - Math.PI / 2;
        const radius = 190;
        p.x = centerX + radius * Math.cos(angle);
        p.y = centerY + radius * Math.sin(angle);

        // Position children (tech & badges) around product
        const children = simNodes.filter((n) => n.productId === p.productId && n.id !== p.id);
        const numChildren = children.length;
        children.forEach((c, cIdx) => {
          const childAngle = angle + ((cIdx - (numChildren - 1) / 2) * 0.45);
          const childRadius = 310;
          c.x = centerX + childRadius * Math.cos(childAngle);
          c.y = centerY + childRadius * Math.sin(childAngle);
        });
      });
    }

    // Create D3 Force Simulation with Spaced Distances
    const simulation = d3
      .forceSimulation<GraphNode>(simNodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(simLinks)
          .id((d) => d.id)
          .distance((d) => {
            const src = d.source as GraphNode;
            if (src.type === "maker") return 220;
            return 140;
          })
          .strength(0.8)
      )
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collision", d3.forceCollide().radius((d: any) => d.val + 48));

    // Render Link Lines
    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(simLinks)
      .join("line")
      .attr("stroke-width", 2)
      .attr("stroke", (d: any) => (d.source.type === "maker" ? "#f43f5e" : "#6366f1"))
      .attr("stroke-opacity", 0.4)
      .attr("stroke-dasharray", (d: any) => (d.target.type === "tech" ? "5 5" : "none"));

    // Render Link Badge Pills (Clean hoverable badges)
    const linkBadgeGroup = container
      .append("g")
      .attr("class", "link-badges")
      .selectAll("g")
      .data(simLinks)
      .join("g")
      .style("opacity", 0.75);

    linkBadgeGroup
      .append("rect")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", "var(--background)")
      .attr("stroke", "var(--foreground)")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.2);

    const linkText = linkBadgeGroup
      .append("text")
      .text((d) => d.relationship)
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .attr("fill", "var(--muted)")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-family", "monospace");

    // Dynamic padding for link badges
    linkBadgeGroup.each(function () {
      const g = d3.select(this);
      const textNode = g.select("text").node() as SVGTextElement | null;
      if (textNode) {
        const bbox = textNode.getBBox();
        g.select("rect")
          .attr("x", bbox.x - 5)
          .attr("y", bbox.y - 3)
          .attr("width", bbox.width + 10)
          .attr("height", bbox.height + 6);
      }
    });

    // Render Node Groups
    const node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, GraphNode>(".node")
      .data(simNodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on("mouseenter", (event, d) => {
        setHoveredNode(d);
      })
      .on("mouseleave", () => {
        setHoveredNode(null);
      })
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            if (d.type !== "maker") {
              d.fx = null;
              d.fy = null;
            }
          })
      );

    // Node Outer Glow Ring
    node
      .append("circle")
      .attr("r", (d) => d.val + 8)
      .attr("fill", (d) => d.color)
      .attr("fill-opacity", 0.15)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => (d.type === "maker" ? "none" : "4 4"));

    // Node Inner Core Circle
    node
      .append("circle")
      .attr("r", (d) => d.val)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    // Node Icon / Type Initial inside circle
    node
      .append("text")
      .text((d) => {
        if (d.type === "maker") return "👤";
        if (d.type === "product") return "🚀";
        if (d.type === "tech") return "⚡";
        return "🏆";
      })
      .attr("x", 0)
      .attr("y", 1)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d) => (d.type === "maker" ? "16px" : "12px"));

    // Node Label Badge Pill (Eliminates text overlap completely!)
    const labelGroup = node
      .append("g")
      .attr("class", "label-pill")
      .attr("transform", (d) => `translate(0, ${d.val + 18})`);

    labelGroup
      .append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "var(--background)")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 1.5)
      .style("filter", "drop-shadow(0 2px 6px rgba(0,0,0,0.15))");

    const labelText = labelGroup
      .append("text")
      .text((d) => d.label)
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d) => (d.type === "maker" ? "12px" : "11px"))
      .attr("font-weight", "bold")
      .attr("fill", "var(--foreground)")
      .attr("font-family", "inherit");

    // Add upvote badge inside pill if applicable
    labelGroup.each(function (d) {
      const g = d3.select(this);
      const textNode = g.select("text").node() as SVGTextElement | null;
      if (textNode) {
        const bbox = textNode.getBBox();
        g.select("rect")
          .attr("x", bbox.x - 8)
          .attr("y", bbox.y - 4)
          .attr("width", bbox.width + 16)
          .attr("height", bbox.height + 8);
      }
    });

    // Subtitle / Upvote Badge underneath pill
    node
      .filter((d) => !!d.upvotes)
      .append("text")
      .text((d) => `▲ ${d.upvotes}`)
      .attr("x", 0)
      .attr("y", (d) => d.val + 38)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#f43f5e")
      .attr("font-weight", "bold")
      .attr("font-family", "monospace");

    // Simulation Tick Update
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkBadgeGroup.attr("transform", (d: any) => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        return `translate(${x},${y})`;
      });

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, activeTab, layoutMode]);

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    if (direction === "in") {
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.25);
    } else if (direction === "out") {
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.8);
    } else {
      svg.transition().duration(300).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const handleCopyShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!maker) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        {/* Backdrop overlay dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Container (Doodle Theme) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-5xl bg-[var(--background)] border-2 border-[var(--foreground)] rounded-3xl shadow-2xl overflow-hidden doodle-card flex flex-col max-h-[92vh]"
        >
          {/* Top Gradient Ribbon Header */}
          <div className="h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 w-full shrink-0" />

          {/* 1. Modal Header & Maker Profile */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <img
                src={
                  maker.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                }
                alt={maker.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ring-4 ring-rose-500/20 object-cover p-1 bg-white dark:bg-slate-800 shadow-md shrink-0"
              />

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold doodle-font text-[var(--foreground)]">
                    {maker.name}
                  </h2>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold doodle-badge bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    Product Maker Portfolio
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-rose-500 font-mono font-semibold mt-0.5">
                  {maker.headline || `@${maker.username}`}
                </p>

                {/* Maker Stats Bar */}
                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-[var(--muted)]">
                  <span>🚀 {makerProducts.length} Launches</span>
                  <span>•</span>
                  <span>▲ {totalUpvotes} Total Upvotes</span>
                  <span>•</span>
                  <span>🛠️ {allTechStack.length} Tech Specs</span>
                </div>
              </div>
            </div>

            {/* Top Right Action & Navigation */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {maker.twitterUrl && (
                <a
                  href={maker.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sky-500 hover:bg-sky-500/10 transition-colors"
                  title="Twitter / X Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {maker.productHuntUrl && (
                <a
                  href={maker.productHuntUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Product Hunt Profile"
                >
                  <Flame className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={handleCopyShare}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                title="Share Portfolio"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. AI Maker Synopsis & View Tabs */}
          <div className="px-6 py-3 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-rose-500/5 shrink-0">
            <div className="flex items-center gap-2 text-xs text-[var(--foreground)]">
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
              <span className="font-semibold italic">
                AI Maker Insight: Prolific builder behind {makerProducts.length} Product Hunt launches with {totalUpvotes} total upvotes.
              </span>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-white/10 font-mono text-xs">
              <button
                onClick={() => setActiveTab("graph")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === "graph"
                    ? "bg-rose-600 text-white shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Network className="w-3.5 h-3.5" /> Clean Graph
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === "list"
                    ? "bg-rose-600 text-white shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <List className="w-3.5 h-3.5" /> Portfolio Products ({makerProducts.length})
              </button>
              <button
                onClick={() => setActiveTab("tech")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === "tech"
                    ? "bg-rose-600 text-white shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Tech Radar
              </button>
            </div>
          </div>

          {/* 3. Main Modal Content Body */}
          <div className="flex-1 relative overflow-hidden flex flex-col min-h-[460px]">
            {/* TAB 1: INTERACTIVE GRAPH VIEW */}
            {activeTab === "graph" && (
              <div className="relative w-full h-full flex-1 flex flex-col bg-slate-100/70 dark:bg-slate-950/60">
                {/* SVG Force Canvas */}
                <svg
                  ref={svgRef}
                  className="w-full h-full min-h-[480px] flex-1 cursor-grab active:cursor-grabbing"
                />

                {/* Graph Controls Toolbar */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 rounded-2xl doodle-card bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-white/10 text-xs font-mono">
                  {/* Layout Mode Toggle */}
                  <button
                    onClick={() => setLayoutMode((m) => (m === "orbit" ? "force" : "orbit"))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      layoutMode === "orbit"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-white/10 text-[var(--foreground)]"
                    }`}
                    title="Switch Layout Mode"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    {layoutMode === "orbit" ? "Orbit Ring" : "Free Force"}
                  </button>

                  <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />

                  <button
                    onClick={() => handleZoom("in")}
                    className="p-1.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleZoom("out")}
                    className="p-1.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleZoom("reset")}
                    className="p-1.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    title="Reset Camera"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-[var(--muted)] border-l border-slate-200 dark:border-white/10">
                    Zoom: {Math.round(zoomLevel * 100)}%
                  </span>
                </div>

                {/* Graph Legend Overlay */}
                <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-3 p-2.5 rounded-2xl doodle-card bg-white/90 dark:bg-slate-900/90 shadow-md border border-slate-200 dark:border-white/10 text-[11px] font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" /> Maker
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" /> Product
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" /> Tech Stack
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500" /> Award
                  </span>
                </div>

                {/* Selected Node Inspector Drawer */}
                <AnimatePresence>
                  {selectedNode && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="absolute top-4 right-4 z-20 max-w-xs w-full p-5 rounded-2xl doodle-card bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-rose-500/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono bg-rose-500/10 text-rose-500">
                          {selectedNode.type} Node
                        </span>
                        <button
                          onClick={() => setSelectedNode(null)}
                          className="p-1 rounded-lg text-[var(--muted)] hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-extrabold text-base doodle-font text-[var(--foreground)]">
                        {selectedNode.label}
                      </h4>
                      <p className="text-xs text-[var(--muted)] font-mono">
                        {selectedNode.subtitle}
                      </p>

                      {selectedNode.productRef && (
                        <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
                          <p className="text-xs text-[var(--foreground)] line-clamp-2">
                            {selectedNode.productRef.tagline}
                          </p>
                          {currentProduct && selectedNode.productRef.id === currentProduct.id ? (
                            <button
                              onClick={onClose}
                              className="doodle-btn w-full py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-[var(--foreground)] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500 hover:text-white transition-colors shadow-sm"
                            >
                              Close & View Current Product
                            </button>
                          ) : (
                            <Link
                              href={`/producthunt/${selectedNode.productRef.id}`}
                              onClick={onClose}
                              className="doodle-btn w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                            >
                              Explore Product Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 2: PORTFOLIO PRODUCTS LIST */}
            {activeTab === "list" && (
              <div className="p-6 overflow-y-auto max-h-[500px] space-y-4">
                <h3 className="text-base font-extrabold doodle-font text-[var(--foreground)] flex items-center gap-2">
                  🚀 All Products Created by {maker.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {makerProducts.map((p) => (
                    <div
                      key={p.id}
                      className="doodle-card p-5 space-y-3 flex flex-col justify-between hover:border-rose-500/50 transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.logo}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl ring-2 ring-rose-500/20 object-cover p-1 bg-white dark:bg-slate-800"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120";
                              }}
                            />
                            <div>
                              <h4 className="font-bold text-base doodle-font text-[var(--foreground)] group-hover:text-rose-500 transition-colors">
                                {p.name}
                              </h4>
                              <span className="text-[11px] font-bold text-rose-500 font-mono">
                                {p.category}
                              </span>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold doodle-badge bg-rose-500/10 text-rose-500 font-mono">
                            ▲ {p.votesCount}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                          {p.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.techStack.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] font-mono text-[var(--muted)] border border-slate-200 dark:border-white/10"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[var(--muted)] font-mono">
                          Launched {p.launchedAtFormatted}
                        </span>
                        <Link
                          href={`/producthunt/${p.id}`}
                          onClick={onClose}
                          className="doodle-btn px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TECH RADAR BREAKDOWN */}
            {activeTab === "tech" && (
              <div className="p-6 overflow-y-auto max-h-[500px] space-y-6">
                <div>
                  <h3 className="text-base font-extrabold doodle-font text-[var(--foreground)] flex items-center gap-2 mb-2">
                    🛠️ Tech Stack & Infrastructure Radar
                  </h3>
                  <p className="text-xs text-[var(--muted)] font-mono">
                    Technologies utilized across {maker.name}'s products on Product Hunt.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {allTechStack.map((tech) => (
                    <div
                      key={tech}
                      className="doodle-card p-4 flex items-center gap-3 bg-indigo-500/5 border-indigo-500/20"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-mono font-bold text-xs">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm doodle-font text-[var(--foreground)]">
                          {tech}
                        </h4>
                        <span className="text-[10px] text-rose-500 font-mono font-semibold">
                          Core Technology Spec
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Modal Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-[var(--muted)] bg-slate-50/50 dark:bg-white/[0.02] shrink-0">
            <span>✨ Product Hunt Ecosystem Graph & Maker Intelligence</span>
            <button
              onClick={onClose}
              className="doodle-btn px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-[var(--foreground)] hover:bg-rose-500 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
