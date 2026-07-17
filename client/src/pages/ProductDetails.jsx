/**
 * ProductDetails — Apple Store–inspired PDP with gallery, sticky purchase panel, related items.
 * Route: /products/:category/:id
 */
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, ShoppingBag, Zap, Package } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { isValidOffer, getUnitPrice } from "../components/ProductFilters";
import { Button, Badge, Card, SectionHeader, EmptyState, Skeleton } from "../components/ui";

const firstProductImage = (p) => p?.images?.[0] || p?.image?.[0] || null;

const ProductDetails = () => {
  const { products, productsLoading, navigate, addToCart, currency } = useAppContext();
  const { id } = useParams();
  const [product, setProduct] = React.useState(() => products.find((p) => p._id === id));
  const [relatedProducts, setRelatedProducts] = React.useState([]);
  const [thumbnail, setThumbnail] = React.useState(() => firstProductImage(product));

  useEffect(() => {
    const found = products.find((p) => p._id === id);
    setProduct(found);
  }, [id, products]);

  useEffect(() => {
    if (!product) return;
    setThumbnail(firstProductImage(product));
    setRelatedProducts(
      products.filter((item) => item.category === product.category && item._id !== product._id).slice(0, 5)
    );
  }, [product, products]);

  if (productsLoading) {
    return (
      <div className="py-8 md:py-12 mb-nav animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-[24px]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 mb-nav">
        <EmptyState
          icon={Package}
          title="Product not found"
          description="This product doesn’t exist or is no longer available."
          action={
            <Button asChild>
              <Link to="/products">Browse products</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const hasOffer = isValidOffer(product);
  const unitPrice = getUnitPrice(product);
  const images = product.images || [];

  return (
    <div className="py-8 md:py-12 mb-nav animate-fade-in">
      <nav className="text-sm text-text-tertiary mb-6 flex flex-wrap gap-1">
        <Link className="hover:text-primary" to="/">Home</Link>
        <span>/</span>
        <Link className="hover:text-primary" to="/products">Products</Link>
        <span>/</span>
        <Link className="hover:text-primary" to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-text-primary">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col gap-2 overflow-x-auto no-scrollbar">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setThumbnail(image)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] border overflow-hidden shrink-0 cursor-pointer transition-all ${
                  thumbnail === image
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-square rounded-[24px] bg-surface-muted border border-border/50 overflow-hidden flex items-center justify-center group">
            <img
              src={thumbnail}
              alt={product.name}
              className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Purchase panel */}
        <div className="lg:sticky lg:top-28 self-start space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
              {product.category}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < (product.rating || 0) ? "fill-primary text-primary" : "fill-primary/20 text-primary/20"}`}
                  strokeWidth={0}
                />
              ))}
              <span className="text-sm text-text-tertiary ml-1">({product.rating || 0})</span>
              {product.inStock ? (
                <Badge variant="success" className="ml-2">In stock</Badge>
              ) : (
                <Badge variant="error" className="ml-2">Out of stock</Badge>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-text-primary">
                {currency}{unitPrice}
              </span>
              {hasOffer && (
                <span className="text-text-tertiary line-through text-lg">
                  {currency}{product.price}
                </span>
              )}
            </div>
            <p className="text-xs text-text-tertiary mt-1">Inclusive of all taxes</p>
          </div>

          <Card className="p-5!" padding={false}>
            <h3 className="font-heading font-semibold text-text-primary mb-3">About this product</h3>
            <ul className="space-y-2">
              {(product.description || []).map((desc, index) => (
                <li key={index} className="text-sm text-text-secondary flex gap-2">
                  <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {desc}
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              disabled={!product.inStock}
              onClick={() => addToCart(product._id)}
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={!product.inStock}
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
            >
              <Zap className="w-4 h-4" /> Buy Now
            </Button>
          </div>

          <Card className="p-5! bg-surface-muted/50">
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">Reviews</h3>
            <p className="text-sm text-text-tertiary">
              Customer reviews coming soon. Rated {product.rating || 0}/5 by early shoppers.
            </p>
          </Card>
        </div>
      </div>

      {relatedProducts.filter((p) => p.inStock).length > 0 && (
        <section className="mt-16 md:mt-20">
          <SectionHeader title="Related products" subtitle="More from this category" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
            {relatedProducts.filter((p) => p.inStock).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button variant="outline" onClick={() => { navigate("/products"); scrollTo(0, 0); }}>
              See more
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
