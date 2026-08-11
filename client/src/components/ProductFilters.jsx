/**
 * ProductFilters — advanced catalog filters & sort controls for the All Products page.
 * Used by AllProducts (desktop sidebar + mobile drawer). Frontend-only; no API changes.
 * Fully localized with t() and tCategory().
 */
import { X, SlidersHorizontal } from "lucide-react";
import { categories } from "../assets/assets";
import { Button, Badge } from "./ui";
import { useLanguage } from "../context/LanguageContext";

export const SORT_OPTIONS = [
  { value: "featured", labelKey: "filters.sort_featured" },
  { value: "price-asc", labelKey: "filters.sort_low_high" },
  { value: "price-desc", labelKey: "filters.sort_high_low" },
  { value: "name-asc", labelKey: "filters.sort_name_asc" },
  { value: "name-desc", labelKey: "filters.sort_name_desc" },
  { value: "rating-desc", labelKey: "filters.sort_top_rated" },
  { value: "discount-desc", labelKey: "filters.sort_best_discount" },
];

export const DEFAULT_FILTERS = {
  categories: [],
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  stock: "inStock", // all | inStock | outOfStock
  onSale: false,
};

export const isValidOffer = (p) => {
  const price = Number(p.price) || 0;
  const offer = Number(p.offerPrice) || 0;
  return offer > 0 && offer < price;
};

export const getUnitPrice = (p) =>
  isValidOffer(p) ? Number(p.offerPrice) : Number(p.price) || 0;

export const getDiscountPercent = (p) => {
  if (!isValidOffer(p)) return 0;
  const price = Number(p.price) || 0;
  const offer = Number(p.offerPrice) || 0;
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

  if (filters.minPrice !== "") {
    const min = Number(filters.minPrice);
    if (!Number.isNaN(min)) {
      list = list.filter((p) => getUnitPrice(p) >= min);
    }
  }

  if (filters.maxPrice !== "") {
    const max = Number(filters.maxPrice);
    if (!Number.isNaN(max)) {
      list = list.filter((p) => getUnitPrice(p) <= max);
    }
  }

  if (filters.minRating > 0) {
    list = list.filter((p) => (Number(p.rating) || 4.5) >= filters.minRating);
  }

  if (filters.stock === "inStock") {
    list = list.filter((p) => (p.stock !== undefined ? p.stock > 0 : true));
  } else if (filters.stock === "outOfStock") {
    list = list.filter((p) => p.stock === 0);
  }

  if (filters.onSale) {
    list = list.filter(isValidOffer);
  }

  if (sort === "price-asc") {
    list.sort((a, b) => getUnitPrice(a) - getUnitPrice(b));
  } else if (sort === "price-desc") {
    list.sort((a, b) => getUnitPrice(b) - getUnitPrice(a));
  } else if (sort === "name-asc") {
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sort === "name-desc") {
    list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
  } else if (sort === "rating-desc") {
    list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else if (sort === "discount-desc") {
    list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
  }

  return list;
};

export const countActiveFilters = (f) => {
  let c = 0;
  if (f.categories.length > 0) c += f.categories.length;
  if (f.minPrice !== "" || f.maxPrice !== "") c += 1;
  if (f.minRating > 0) c += 1;
  if (f.stock !== "inStock") c += 1;
  if (f.onSale) c += 1;
  return c;
};

const ProductFilters = ({
  filters,
  setFilters,
  priceBounds = { min: 0, max: 100 },
  sort,
  setSort,
  onClear,
  onClose,
  className = "",
}) => {
  const { t, tCategory } = useLanguage();

  const toggleCategory = (catPath) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(catPath);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== catPath)
          : [...prev.categories, catPath],
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
          <h3 className="font-heading font-bold text-text-primary text-sm">{t("filters.title")}</h3>
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
            {t("filters.clear_all")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-[12px] flex items-center justify-center text-text-tertiary hover:bg-surface-muted cursor-pointer lg:hidden"
              aria-label={t("filters.title")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sort (shown in panel on mobile; desktop also has top bar) */}
      <div className="lg:hidden space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {t("filters.sort_by")}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full h-11 px-3 rounded-[16px] border border-border bg-bg-white text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {t("filters.category")}
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
                <span className="text-sm font-medium">{tCategory(cat.text)}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {t("filters.price_range")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder={t("filters.min_price", { min: priceBounds.min })}
            value={filters.minPrice}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
            className="h-11 px-3 rounded-[16px] border border-border bg-bg-white text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            aria-label={t("filters.min_price", { min: priceBounds.min })}
          />
          <input
            type="number"
            min={0}
            placeholder={t("filters.max_price", { max: priceBounds.max })}
            value={filters.maxPrice}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
            className="h-11 px-3 rounded-[16px] border border-border bg-bg-white text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            aria-label={t("filters.max_price", { max: priceBounds.max })}
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
          aria-label={t("filters.max_price_slider")}
        />
      </div>

      {/* Rating */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {t("filters.min_rating")}
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
              {r === 0 ? t("filters.rating_any") : `${r}+ ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {t("filters.availability")}
        </p>
        <div className="space-y-1">
          {[
            { value: "inStock", label: t("filters.in_stock_only") },
            { value: "all", label: t("filters.all_items") },
            { value: "outOfStock", label: t("filters.out_of_stock") },
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
          <p className="text-sm font-semibold text-text-primary">{t("filters.on_sale_only")}</p>
          <p className="text-xs text-text-tertiary">{t("filters.on_sale_desc")}</p>
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
          {t("filters.show_results")}
        </Button>
      )}
    </aside>
  );
};

export default ProductFilters;
