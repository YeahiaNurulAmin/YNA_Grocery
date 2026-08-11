/**
 * Wishlist — UI-only saved products placeholder (no backend).
 * Route: /wishlist
 */
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, Button, SectionHeader } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

const Wishlist = () => {
  const { t } = useLanguage();

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
      <SectionHeader
        eyebrow={t("wishlist.eyebrow")}
        title={t("wishlist.title")}
        subtitle={t("wishlist.subtitle")}
      />
      <EmptyState
        icon={Heart}
        title={t("wishlist.empty_title")}
        description={t("wishlist.empty_desc")}
        action={
          <Button asChild>
            <Link to="/products">{t("wishlist.browse")}</Link>
          </Button>
        }
      />
    </div>
  );
};

export default Wishlist;
