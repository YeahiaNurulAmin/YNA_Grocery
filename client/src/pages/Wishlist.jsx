/**
 * Wishlist — UI-only saved products placeholder (no backend).
 * Route: /wishlist
 */
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, Button, SectionHeader } from "../components/ui";

const Wishlist = () => (
  <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
    <SectionHeader
      eyebrow="Account"
      title="Wishlist"
      subtitle="Save favorites for later — coming soon with full sync."
    />
    <EmptyState
      icon={Heart}
      title="Your wishlist is empty"
      description="Tap the heart on products (coming soon) to build a list of favorites."
      action={
        <Link to="/products">
          <Button>Browse products</Button>
        </Link>
      }
    />
  </div>
);

export default Wishlist;
