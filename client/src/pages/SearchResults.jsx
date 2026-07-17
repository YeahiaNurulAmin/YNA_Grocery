/**
 * SearchResults — product search results driven by AppContext searchQuery.
 * Route: /search
 */
import { Search as SearchIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { SectionHeader, EmptyState, Button } from "../components/ui";

const SearchResults = () => {
  const { products, searchQuery, setSearchQuery, navigate } = useAppContext();
  const q = (searchQuery || "").trim().toLowerCase();
  const results = q
    ? products.filter(
        (p) =>
          p.inStock &&
          (p.name.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q))
      )
    : products.filter((p) => p.inStock).slice(0, 12);

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in">
      <SectionHeader
        eyebrow="Search"
        title={q ? `Results for “${searchQuery}”` : "Search products"}
        subtitle={q ? `${results.length} matches` : "Type in the navbar or below to find groceries."}
      />

      <div className="mb-8 max-w-lg">
        <div className="flex items-center gap-2 h-12 px-4 rounded-[16px] bg-bg-white border border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
          <SearchIcon className="w-4 h-4 text-text-tertiary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or category…"
            className="w-full bg-transparent outline-none text-sm"
            aria-label="Search"
          />
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No matches"
          description="Try another keyword or browse the full catalog."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                navigate("/products");
              }}
            >
              Browse all
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
