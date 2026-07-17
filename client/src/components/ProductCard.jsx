/**
 * ProductCard — premium product tile with image, price, rating, stock, quick-add.
 * Used on Home (BestSeller), All Products, Category, Search, Related products.
 */
import { Link } from "react-router-dom";
import { Star, Plus, Minus, ShoppingBag } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Badge } from "./ui";
import { isValidOffer, getUnitPrice, getDiscountPercent } from "./ProductFilters";

const ProductCard = ({ product }) => {
  const { currency, cartItems, addToCart, removeFromCart } = useAppContext();

  if (!product) return null;

  const image = product.images?.[0] || product.image?.[0];
  const hasOffer = isValidOffer(product);
  const discount = getDiscountPercent(product);
  const unitPrice = getUnitPrice(product);
  const qty = cartItems?.[product._id] || 0;
  const productUrl = `/products/${product.category.toLowerCase()}/${product._id}`;

  return (
    <article className="group relative flex flex-col bg-bg-white rounded-[24px] border border-border/50 shadow-sm overflow-hidden transition-all duration-250 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      <Link
        to={productUrl}
        onClick={() => scrollTo(0, 0)}
        className="flex flex-col flex-1 min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
      >
        <div className="relative aspect-square bg-gradient-to-b from-surface-muted to-bg-white p-5 flex items-center justify-center overflow-hidden">
          {hasOffer && (
            <Badge variant="accent" className="absolute top-3 left-3 z-10">
              −{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="error" className="absolute top-3 right-3 z-10">
              Out of stock
            </Badge>
          )}
          {product.inStock && product.quantity != null && product.quantity <= 5 && (
            <Badge variant="warning" className="absolute top-3 right-3 z-10">
              Low stock
            </Badge>
          )}
          <img
            src={image}
            alt={product.name}
            className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 p-4 pt-3 gap-1.5 pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            {product.category}
          </p>
          <h3 className="font-heading font-semibold text-text-primary text-[15px] leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < (product.rating || 0) ? "fill-primary" : "fill-primary/20 text-primary/20"}`}
                strokeWidth={0}
              />
            ))}
            <span className="text-xs text-text-tertiary ml-0.5">({product.rating || 0})</span>
          </div>

          <div className="mt-auto pt-3">
            <p className="font-heading text-lg font-bold text-text-primary leading-none">
              {currency}
              {unitPrice}
            </p>
            {hasOffer && (
              <p className="text-xs text-text-tertiary line-through mt-0.5">
                {currency}{product.price}
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute bottom-4 right-4 z-10">
        {!product.inStock ? (
          <span className="text-xs text-text-tertiary px-2">Unavailable</span>
        ) : qty === 0 ? (
          <button
            type="button"
            onClick={() => addToCart(product._id)}
            className="h-10 px-3.5 rounded-[14px] bg-bg-light-mint text-primary border border-primary/20 font-semibold text-sm flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2} />
            Add
          </button>
        ) : (
          <div className="h-10 flex items-center rounded-[14px] bg-bg-light-mint border border-primary/20 select-none">
            <button
              type="button"
              onClick={() => removeFromCart(product._id)}
              className="w-9 h-full flex items-center justify-center text-primary hover:bg-primary/10 rounded-l-[14px] cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-bold text-text-primary">{qty}</span>
            <button
              type="button"
              onClick={() => addToCart(product._id)}
              className="w-9 h-full flex items-center justify-center text-primary hover:bg-primary/10 rounded-r-[14px] cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
