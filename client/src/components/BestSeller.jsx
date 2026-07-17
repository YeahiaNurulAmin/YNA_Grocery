/**
 * BestSeller — featured in-stock products grid on Home.
 */
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { SectionHeader, Button, ProductCardSkeleton } from "./ui";
import { ArrowRight } from "lucide-react";

const BestSeller = () => {
  const { products } = useAppContext();
  const featured = products.filter((p) => p.inStock).slice(0, 8);
  const loading = products.length === 0;

  return (
    <section className="mt-16 md:mt-20">
      <SectionHeader
        eyebrow="Bestsellers"
        title="Fresh favorites"
        subtitle="Hand-picked items customers love this week."
        action={
          <Link to="/products" className="hidden sm:block">
            <Button variant="outline" size="sm">
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </section>
  );
};

export default BestSeller;
