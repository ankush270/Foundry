"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Search,
  Filter,
  Sparkles,
  GitCompare,
  Bookmark,
  LayoutGrid,
  List,
  RefreshCw,
  Rocket,
  Code2,
  SlidersHorizontal,
  Key,
  Radio,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ProductHuntProduct,
  ProductCategory,
  PricingModel,
  ProductHuntFilterOptions,
} from "@/modules/producthunt/types";
import { ProductHuntApiService } from "@/services/producthunt/producthunt-api.service";
import { ProductCard } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";
import { ProductLaunchRadar } from "./ProductLaunchRadar";
import { ProductSideBySideCompare } from "./ProductSideBySideCompare";
import { ProductBookmarkCollections } from "./ProductBookmarkCollections";

const CATEGORIES: ProductCategory[] = [
  "All",
  "AI & Machine Learning",
  "DevTools & Infra",
  "Productivity & SaaS",
  "Design & Creative",
  "Fintech & Web3",
  "Marketing & Sales",
  "No-Code & Mobile",
];

export const ProductHuntExplorer: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductHuntProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<string>("Product Hunt Feed");

  const handleInspect = (product: ProductHuntProduct) => {
    router.push(`/producthunt/${product.slug || product.id}`);
  };

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All");
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | "All">("All");
  const [timeframe, setTimeframe] = useState<
    "Today" | "This Week" | "Featured" | "Top Voted" | "All"
  >("All");
  const [sortBy, setSortBy] = useState<"votes" | "date" | "comments" | "relevance">(
    "votes"
  );

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals state
  const [inspectProduct, setInspectProduct] = useState<ProductHuntProduct | null>(null);
  const [comparingProducts, setComparingProducts] = useState<ProductHuntProduct[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [bookmarkedProducts, setBookmarkedProducts] = useState<ProductHuntProduct[]>([]);
  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  // Load Bookmarks & Token from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("PH_BOOKMARKS");
        if (saved) {
          setBookmarkedProducts(JSON.parse(saved));
        }
        const existingToken = ProductHuntApiService.getProductHuntToken();
        if (existingToken) setTokenInput(existingToken);
      } catch (err) {
        console.error("Failed to parse bookmarks", err);
      }
    }
  }, []);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    ProductHuntApiService.setProductHuntToken(tokenInput);
    setShowTokenModal(false);
    loadProducts();
  };

  // Save Bookmarks to LocalStorage
  const handleToggleBookmark = (product: ProductHuntProduct) => {
    let updated: ProductHuntProduct[] = [];
    if (bookmarkedProducts.some((b) => b.id === product.id)) {
      updated = bookmarkedProducts.filter((b) => b.id !== product.id);
    } else {
      updated = [...bookmarkedProducts, product];
    }
    setBookmarkedProducts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("PH_BOOKMARKS", JSON.stringify(updated));
    }
  };

  // Toggle Compare
  const handleToggleCompare = (product: ProductHuntProduct) => {
    if (comparingProducts.some((c) => c.id === product.id)) {
      setComparingProducts((prev) => prev.filter((c) => c.id !== product.id));
    } else {
      if (comparingProducts.length >= 3) {
        alert("You can compare up to 3 products at a time.");
        return;
      }
      setComparingProducts((prev) => [...prev, product]);
    }
  };

  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Pagination State (30 items per page as requested)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 30; 

  const loadedPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const activePage = Math.min(Math.max(1, currentPage), loadedPages);
  const totalPagesDisplay = hasNextPage ? Math.max(activePage + 1, loadedPages) : loadedPages;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, products.length);
  const currentProducts = products.slice(startIndex, endIndex);

  // Fetch Products Effect
  const loadProducts = async (forceRefresh: boolean = false) => {
    setLoading(true);
    const options: ProductHuntFilterOptions = {
      query: searchQuery,
      category: selectedCategory,
      pricingModel: selectedPricing,
      timeframe,
      sortBy,
      limit: 30,
      refresh: forceRefresh,
    };
    const res = await ProductHuntApiService.fetchProducts(options);
    const seen = new Set<string>();
    const unique = res.products.filter((p) => {
      if (!p.id || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    setProducts(unique);
    setIsLive(res.isLive);
    setDataSource(res.source);
    setEndCursor(res.endCursor || null);
    setHasNextPage(res.hasNextPage || false);
    setCurrentPage(1);
    setLoading(false);
  };

  const handleLoadMore = async () => {
    if (!endCursor || loadingMore) return;
    setLoadingMore(true);
    const options: ProductHuntFilterOptions = {
      query: searchQuery,
      category: selectedCategory,
      pricingModel: selectedPricing,
      timeframe,
      sortBy,
      limit: 30,
      cursor: endCursor,
    };
    const res = await ProductHuntApiService.fetchProducts(options);
    if (res.products.length > 0) {
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = res.products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
      setEndCursor(res.endCursor || null);
      setHasNextPage(res.hasNextPage || false);
    }
    setLoadingMore(false);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1) return;

    const targetItemsCount = newPage * itemsPerPage;

    if (targetItemsCount > products.length && hasNextPage && endCursor && !loadingMore) {
      setLoadingMore(true);
      try {
        let tempProducts = [...products];
        let currentEnd: string | null = endCursor;
        let canFetch: boolean = hasNextPage;

        while (tempProducts.length < targetItemsCount && canFetch && currentEnd) {
          const options: ProductHuntFilterOptions = {
            query: searchQuery,
            category: selectedCategory,
            pricingModel: selectedPricing,
            timeframe,
            sortBy,
            limit: 30,
            cursor: currentEnd,
          };
          const res = await ProductHuntApiService.fetchProducts(options);
          if (res.products.length > 0) {
            const existingIds = new Set(tempProducts.map((p) => p.id));
            const newProds = res.products.filter((p) => !existingIds.has(p.id));
            tempProducts = [...tempProducts, ...newProds];
            currentEnd = res.endCursor || null;
            canFetch = res.hasNextPage || false;
          } else {
            break;
          }
        }

        setProducts(tempProducts);
        setEndCursor(currentEnd);
        setHasNextPage(canFetch);

        const maxPage = Math.max(1, Math.ceil(tempProducts.length / itemsPerPage));
        setCurrentPage(Math.min(newPage, maxPage));
      } catch (err) {
        console.error("[ProductHunt] Error changing page:", err);
      } finally {
        setLoadingMore(false);
      }
    } else {
      setCurrentPage(newPage);
    }

    if (typeof window !== "undefined") {
      const gridEl = document.getElementById("product-grid-section");
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, selectedPricing, timeframe, sortBy]);

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-20 px-3 sm:px-6 max-w-[1440px] mx-auto text-[var(--foreground)] transition-colors duration-300">
      {/* Hero Banner Section (Product Hunt Theme) */}
      <div className="relative rounded-3xl bg-[#FF6154] text-white p-6 sm:p-10 border-2 border-[#DA552F] shadow-[6px_6px_0px_0px_#DA552F] overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider border border-white/30">
              <Flame className="w-4 h-4 text-white fill-white animate-pulse" />
              PRODUCT HUNT LAUNCHES
            </div>

            {/* Live Data Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-xs font-mono font-bold text-emerald-200 border border-emerald-300/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {isLive ? "🟢 LIVE Product Hunt Feed" : "🟡 Curated Dataset"}
            </div>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight mb-3">
            Discover Top Product Hunt Launches
          </h1>

          <p className="text-sm sm:text-base text-rose-100 font-medium leading-relaxed max-w-2xl mb-6">
            Real-time feed of products launched on Product Hunt. Track upvote velocity, explore maker stories, and generate step-by-step SaaS clone blueprints.
          </p>

          {/* Action Stats & Config Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/20 backdrop-blur-md border border-white/20">
              <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Source: {dataSource}</span>
            </div>

            <button
              onClick={() => loadProducts(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Feed
            </button>

            <button
              onClick={() => setShowTokenModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/30 hover:bg-black/40 backdrop-blur-md border border-white/20 text-rose-200 transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              API Token Settings
            </button>
          </div>
        </div>
      </div>

      {/* Top Today Radar Widget */}
      <ProductLaunchRadar
        products={products}
        onSelectProduct={handleInspect}
      />

      {/* Search & Filter Toolbar */}
      <div className="space-y-4 mb-8">
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, makers, or tech stack (e.g. Cursor, Supabase)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-white/10 text-xs text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-rose-500 shadow-sm backdrop-blur-md"
            />
          </div>

          {/* Quick Action Badges (Compare & Bookmarks) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {comparingProducts.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:bg-purple-600 transition-all animate-pulse"
              >
                <GitCompare className="w-4 h-4" />
                Compare ({comparingProducts.length})
              </button>
            )}

            <button
              onClick={() => setShowBookmarksDrawer(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold text-xs hover:bg-amber-500 hover:text-white transition-all"
            >
              <Bookmark className="w-4 h-4" />
              Saved ({bookmarkedProducts.length})
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-rose-600 text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-rose-600 text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips & Selectors Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Categories Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-rose-600 text-white shadow-md shadow-rose-500/30"
                    : "bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pricing & Timeframe Selectors */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-[var(--foreground)] focus:outline-none focus:border-rose-500"
            >
              <option value="All">All Pricing Models</option>
              <option value="Freemium">Freemium</option>
              <option value="Open Source">Open Source</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-[var(--foreground)] focus:outline-none focus:border-rose-500"
            >
              <option value="votes">Most Upvoted</option>
              <option value="comments">Most Commented</option>
              <option value="date">Newest Launch</option>
              <option value="relevance">Featured Launches</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Display Header & Count */}
      <div id="product-grid-section" className="flex flex-wrap items-center justify-between gap-2 mb-4 px-1 scroll-mt-28">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--muted)]">
          <span>
            Showing <span className="text-rose-500 font-extrabold">{products.length > 0 ? startIndex + 1 : 0}–{endIndex}</span> of{" "}
            <span className="text-rose-500 font-extrabold">{products.length}{hasNextPage ? "+" : ""}</span> Product Hunt Launches
          </span>
          {isLive && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
              Live API
            </span>
          )}
        </div>

        {totalPagesDisplay > 1 && (
          <span className="text-xs font-mono text-[var(--muted)]">
            Page <span className="text-[var(--foreground)] font-bold">{activePage}</span> of {totalPagesDisplay}
          </span>
        )}
      </div>

      {/* Products Display List / Grid */}
      {loading ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-[var(--muted)]">
            Fetching live Product Hunt launches...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8">
          <Flame className="w-12 h-12 text-rose-500/50 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-[var(--foreground)]">
            No Products Found
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto mt-1">
            Try tweaking your search terms or resetting selected categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedPricing("All");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-4"
            }
          >
            {currentProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onInspect={handleInspect}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={bookmarkedProducts.some((b) => b.id === prod.id)}
                onToggleCompare={handleToggleCompare}
                isComparing={comparingProducts.some((c) => c.id === prod.id)}
              />
            ))}
          </div>

          {/* Interactive Page Number Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-200 dark:border-white/10 mt-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1 max-w-[320px] overflow-x-auto scrollbar-none py-1">
                {Array.from({ length: totalPagesDisplay }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => handlePageChange(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold font-mono transition-all ${
                      currentPage === pg
                        ? "bg-rose-600 text-white shadow-md shadow-rose-500/30 scale-105"
                        : "bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {pg}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPagesDisplay && !hasNextPage}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Load More API Data Button */}
            {hasNextPage && endCursor && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold font-mono transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingMore ? "animate-spin" : ""}`} />
                {loadingMore ? "Fetching Next API Batch..." : "Fetch More API Products (+30)"}
              </button>
            )}
          </div>
        </>
      )}

      {/* Modal: Deep Dive Inspect */}
      {inspectProduct && (
        <ProductDetailModal
          product={inspectProduct}
          onClose={() => setInspectProduct(null)}
        />
      )}

      {/* Modal: Side-by-Side Compare */}
      {showCompareModal && (
        <ProductSideBySideCompare
          products={comparingProducts}
          onRemove={(p) =>
            setComparingProducts((prev) => prev.filter((c) => c.id !== p.id))
          }
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {/* Drawer: Bookmarks Collection */}
      {showBookmarksDrawer && (
        <ProductBookmarkCollections
          bookmarks={bookmarkedProducts}
          onRemoveBookmark={handleToggleBookmark}
          onInspect={handleInspect}
          onClose={() => setShowBookmarksDrawer(false)}
        />
      )}

      {/* Modal: API Token Settings */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base text-[var(--foreground)]">
                  Product Hunt API Settings
                </h3>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Automatic Mode:</strong> Real-time live products are fetched automatically via Product Hunt's public RSS feed.
              </p>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[var(--foreground)] space-y-1">
                <span className="font-bold text-rose-500 block">How to get official Developer Access Token:</span>
                <ol className="list-decimal list-inside space-y-1 text-[11px]">
                  <li>Go to Product Hunt OAuth Applications: <a href="https://www.producthunt.com/v2/oauth/applications" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline font-bold">producthunt.com/v2/oauth/applications</a></li>
                  <li>Click <strong>"Add an Application"</strong></li>
                  <li>Enter App Name (e.g. <em>Foundry</em>) & Redirect URI (<em>http://localhost:3000</em>)</li>
                  <li>Copy your <strong>Developer Access Token</strong> and paste below:</li>
                </ol>
              </div>
            </div>

            <form onSubmit={handleSaveToken} className="space-y-3">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste Product Hunt Developer Access Token (e.g. user_token_...)..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-[var(--foreground)] focus:outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput("");
                    ProductHuntApiService.setProductHuntToken("");
                    setShowTokenModal(false);
                    loadProducts();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  Clear Token
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20"
                >
                  Save & Fetch Live Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
