/**
 * AllProducts — full catalog with advanced filtering, sorting, and search.
 * Route: /products. Uses ProductFilters (frontend-only; no API changes).
 */
import React, { useEffect, useMemo, useState } from "react";
import { Package, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import ProductFilters, {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  applyProductFilters,
  countActiveFilters,
  getUnitPrice,
} from "../components/ProductFilters";
import {
  SectionHeader,
  EmptyState,
  ProductCardSkeleton,
  Button,
  Badge,
} from "../components/ui";
import { categories } from "../assets/assets";

const AllProducts = () => {
  const { products, searchQuery, setSearchQuery, currency } = useAppContext();
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [sort, setSort] = useState("featured");
  const [mobileOpen, setMobileOpen] = useState(false);

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 100 };
    const prices = products.map(getUnitPrice).filter((n) => n > 0);
    return {
      min: Math.floor(Math.min(...prices, 0)),
      max: Math.ceil(Math.max(...prices, 1)),
    };
  }, [products]);

  const results = useMemo(
    () => applyProductFilters(products, filters, searchQuery, sort),
    [products, filters, searchQuery, sort]
  );

  const activeCount = countActiveFilters(filters);
  const loading = products.length === 0;

  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setSort("featured");
  };

  const removeCategory = (path) => {
    setFilters((p) => ({
      ...p,
      categories: p.categories.filter((c) => c !== path),
    }));
  };

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const categoryLabel = (path) =>
    categories.find((c) => c.path === path)?.text || path;

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in">
      <SectionHeader
        eyebrow="Catalog"
        title="All products"
        subtitle={
          searchQuery
            ? `Results for “${searchQuery}”`
            : "Filter by category, price, rating, and more."
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              priceBounds={priceBounds}
              onClear={clearFilters}
            />
          </div>
        </div>

        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <p className="text-sm text-text-secondary">
              <span className="font-heading font-bold text-text-primary">
                {loading ? "…" : results.length}
              </span>{" "}
              {results.length === 1 ? "product" : "products"}
              {activeCount > 0 && (
                <span className="text-text-tertiary"> · {activeCount} filter{activeCount > 1 ? "s" : ""}</span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeCount > 0 && (
                  <Badge variant="accent" className="ml-0.5">
                    {activeCount}
                  </Badge>
                )}
              </Button>

              <div className="hidden sm:flex items-center gap-2 h-9 pl-3 pr-2 rounded-[14px] border border-border bg-bg-white">
                <ArrowUpDown className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-sm font-medium text-text-primary outline-none cursor-pointer pr-1"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {(activeCount > 0 || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-muted text-xs font-semibold text-text-secondary hover:text-error cursor-pointer"
                >
                  Search: {searchQuery}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.categories.map((path) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => removeCategory(path)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-bg-light-mint text-xs font-semibold text-primary cursor-pointer"
                >
                  {categoryLabel(path)}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.minPrice !== "" && (
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, minPrice: "" }))}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-muted text-xs font-semibold cursor-pointer"
                >
                  Min {currency}{filters.minPrice}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.maxPrice !== "" && (
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, maxPrice: "" }))}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-muted text-xs font-semibold cursor-pointer"
                >
                  Max {currency}{filters.maxPrice}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.minRating > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, minRating: 0 }))}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-muted text-xs font-semibold cursor-pointer"
                >
                  {filters.minRating}+ ★
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.onSale && (
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, onSale: false }))}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-accent/10 text-accent-dark text-xs font-semibold cursor-pointer"
                >
                  On sale
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.stock !== "inStock" && (
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, stock: "inStock" }))}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-muted text-xs font-semibold cursor-pointer"
                >
                  {filters.stock === "all" ? "All items" : "Out of stock"}
                  <X className="w-3 h-3" />
                </button>
              )}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer px-2"
                >
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* Mobile sort */}
          <div className="sm:hidden mb-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-11 px-3 rounded-[16px] border border-border bg-bg-white text-sm font-medium focus:outline-none focus:border-primary"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products match"
              description="Try clearing filters or adjusting price and category."
              action={
                <Button variant="outline" onClick={clearFilters}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {results.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm p-4 animate-slide-up overflow-y-auto">
            <ProductFilters
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              priceBounds={priceBounds}
              onClear={clearFilters}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
