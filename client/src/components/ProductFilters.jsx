/**
 * ProductFilters — advanced catalog filters & sort controls for the All Products page.
 * Used by AllProducts (desktop sidebar + mobile drawer). Frontend-only; no API changes.
 */
import { X, SlidersHorizontal } from "lucide-react";
import { categories } from "../assets/assets";
import { Button, Badge } from "./ui";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
  { value: "rating-desc", label: "Top rated" },
  { value: "discount-desc", label: "Best discount" },
];

export const DEFAULT_FILTERS = {
  categories: [],
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  stock: "inStock", // all | inStock | outOfStock
  onSale: false,
};

export const getUnitPrice = (p) =>
  Number(p.offerPrice > 0 ? p.offerPrice : p.price) || 0;

export const getDiscountPercent = (p) => {
  const price = Number(p.price) || 0;
  const offer = Number(p.offerPrice) || 0;
  if (!price || !offer || offer >= price) return 0;
  return Math.round(((price - offer) / price) * 100);
};

export const applyProductFilters = (products, filters, searchQuery, sort) => {
  const q = (searchQuery || "").trim().toLowerCase();
  let list = products.slice();

  if (q) {
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  if (filters.categories.length > 0) {
    const selected = filters.categories.map((c) => c.toLowerCase());
    list = list.filter((p) => selected.includes(p.category?.toLowerCase()));
  }

  const minP = filters.minPrice === "" ? null : Number(filters.minPrice);
  const maxP = filters.maxPrice === "" ? null : Number(filters.maxPrice);
  if (minP != null && !Number.isNaN(minP)) {
    list = list.filter((p) => getUnitPrice(p) >= minP);
  }
  if (maxP != null && !Number.isNaN(maxP)) {
    list = list.filter((p) => getUnitPrice(p) <= maxP);
  }

  if (filters.minRating > 0) {
    list = list.filter((p) => (p.rating || 0) >= filters.minRating);
  }

  if (filters.stock === "inStock") {
    list = list.filter((p) => p.inStock);
  } else if (filters.stock === "outOfStock") {
    list = list.filter((p) => !p.inStock);
  }

  if (filters.onSale) {
    list = list.filter((p) => getDiscountPercent(p) > 0);
  }

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => getUnitPrice(a) - getUnitPrice(b));
      break;
    case "price-desc":
      list.sort((a, b) => getUnitPrice(b) - getUnitPrice(a));
      break;
    case "name-asc":
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      break;
    case "name-desc":
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      break;
    case "rating-desc":
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "discount-desc":
      list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
      break;
    default:
      break;
  }

  return list;
};

export const countActiveFilters = (filters) => {
  let n = 0;
  if (filters.categories.length) n += filters.categories.length;
  if (filters.minPrice !== "") n += 1;
  if (filters.maxPrice !== "") n += 1;
  if (filters.minRating > 0) n += 1;
  if (filters.stock !== "inStock") n += 1;
  if (filters.onSale) n += 1;
  return n;
};

const ProductFilters = ({
  filters,
  setFilters,
  sort,
  setSort,
  priceBounds,
  onClear,
  onClose,
  className = "",
}) => {
  const toggleCategory = (path) => {
    setFilters((prev) => {
      const has = prev.categories.includes(path);
      return {
        ...prev,
        categories: has
          ? prev.categories.filter((c) => c !== path)
          : [...prev.categories, path],
      };
    });
  };

  return (
    <aside
      className={`bg-bg-white border border-border/60 rounded-[24px] shadow-sm p-5 space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" strokeWidth={1.75} />
          <h3 className="font-heading font-bold text-text-primary text-sm">Filters</h3>
          {countActiveFilters(filters) > 0 && (
            <Badge variant="accent">{countActiveFilters(filters)}</Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-text-tertiary hover:text-primary cursor-pointer px-2 py-1"
          >
            Clear
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-[12px] flex items-center justify-center text-text-tertiary hover:bg-surface-muted cursor-pointer lg:hidden"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sort (shown in panel on mobile; desktop also has top bar) */}
      <div className="lg:hidden space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Sort by
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full h-11 px-3 rounded-[16px] border border-border bg-bg-white text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Category
        </p>
        <div className="space-y-1.5 max-h-52 overflow-y-auto no-scrollbar">
          {categories.map((cat) => {
            const active = filters.categories.includes(cat.path);
            return (
              <label
                key={cat.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[14px] cursor-pointer transition-colors ${
                  active ? "bg-bg-light-mint text-primary" : "hover:bg-surface-muted text-text-secondary"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCategory(cat.path)}
                  className="accent-primary w-3.5 h-3.5 rounded"
                />
                <span className="text-sm font-medium">{cat.text}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Price range
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder={`Min ${priceBounds.min}`}
            value={filters.minPrice}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
            className="h-11 px-3 rounded-[16px] border border-border bg-bg-white text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            aria-label="Minimum price"
          />
          <input
            type="number"
            min={0}
            placeholder={`Max ${priceBounds.max}`}
            value={filters.maxPrice}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
            className="h-11 px-3 rounded-[16px] border border-border bg-bg-white text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            aria-label="Maximum price"
          />
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max || 1}
          value={
            filters.maxPrice === ""
              ? priceBounds.max
              : Math.min(Number(filters.maxPrice) || priceBounds.max, priceBounds.max)
          }
          onChange={(e) =>
            setFilters((p) => ({ ...p, maxPrice: e.target.value }))
          }
          className="w-full accent-primary"
          aria-label="Max price slider"
        />
      </div>

      {/* Rating */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Minimum rating
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[0, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilters((p) => ({ ...p, minRating: r }))}
              className={`h-9 px-3 rounded-[12px] text-xs font-semibold border transition-colors cursor-pointer ${
                filters.minRating === r
                  ? "bg-primary text-white border-primary"
                  : "bg-bg-white text-text-secondary border-border hover:border-primary/40"
              }`}
            >
              {r === 0 ? "Any" : `${r}+ ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Availability
        </p>
        <div className="space-y-1">
          {[
            { value: "inStock", label: "In stock" },
            { value: "all", label: "All items" },
            { value: "outOfStock", label: "Out of stock" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] cursor-pointer hover:bg-surface-muted text-sm text-text-secondary"
            >
              <input
                type="radio"
                name="stock"
                checked={filters.stock === opt.value}
                onChange={() => setFilters((p) => ({ ...p, stock: opt.value }))}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* On sale */}
      <label className="flex items-center justify-between gap-3 px-3 py-3 rounded-[14px] bg-bg-soft-peach/60 border border-accent/15 cursor-pointer">
        <div>
          <p className="text-sm font-semibold text-text-primary">On sale only</p>
          <p className="text-xs text-text-tertiary">Items with a discount</p>
        </div>
        <input
          type="checkbox"
          checked={filters.onSale}
          onChange={(e) => setFilters((p) => ({ ...p, onSale: e.target.checked }))}
          className="accent-accent w-4 h-4"
        />
      </label>

      {onClose && (
        <Button className="w-full lg:hidden" onClick={onClose}>
          Show results
        </Button>
      )}
    </aside>
  );
};

export default ProductFilters;
