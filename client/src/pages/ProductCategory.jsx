/**
 * ProductCategory — products filtered by category path param.
 * Route: /products/:category
 */
import { useParams, Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { SectionHeader, EmptyState, Button } from "../components/ui";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (cargo) => cargo.path.toLowerCase() === category.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
  const inStock = filteredProducts.filter((p) => p.inStock);

  if (!searchCategory) {
    return (
      <div className="py-16 mb-nav">
        <EmptyState
          icon={Package}
          title="Category not found"
          description="This category doesn’t exist. Browse all products instead."
          action={
            <Button asChild>
              <Link to="/products">All products</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in">
      <SectionHeader
        eyebrow="Category"
        title={searchCategory.text}
        subtitle={`${inStock.length} products available`}
      />

      {inStock.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nothing in stock here"
          description="Check back soon or explore other categories."
          action={
            <Button asChild variant="outline">
              <Link to="/products">Browse all</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {inStock.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
