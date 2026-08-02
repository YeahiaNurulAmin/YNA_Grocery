/**
 * BestSeller — featured in-stock products grid on Home.
 * Used on the Home page; reads productsLoading / productsError from AppContext.
 */
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { SectionHeader, Button, ProductCardSkeleton, EmptyState } from "./ui";
import { ArrowRight, Package } from "lucide-react";

const BestSeller = () => {
  const { products, productsLoading, productsError } = useAppContext();
  const { t, isRTL } = useLanguage();
  const featured = products.filter((p) => p.inStock).slice(0, 8);

  return (
    <section className="mt-16 md:mt-20">
      <SectionHeader
        eyebrow={t("home.best_sellers")}
        title={t("home.featured_products")}
        subtitle=""
        action={
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/products">
              {t("home.view_all")} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </Button>
        }
      />
      {productsError ? (
        <EmptyState
          icon={Package}
          title="Couldn’t load products"
          description={productsError}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      )}
    </section>
  );
};

export default BestSeller;
