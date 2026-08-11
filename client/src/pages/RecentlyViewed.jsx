/**
 * RecentlyViewed — UI-only recently viewed products placeholder.
 * Route: /recently-viewed
 */
import { History } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, Button, SectionHeader } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

const RecentlyViewed = () => {
  const { t } = useLanguage();

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
      <SectionHeader
        eyebrow={t("recently_viewed.eyebrow")}
        title={t("recently_viewed.title")}
        subtitle={t("recently_viewed.subtitle")}
      />
      <EmptyState
        icon={History}
        title={t("recently_viewed.empty_title")}
        description={t("recently_viewed.empty_desc")}
        action={
          <Link to="/products">
            <Button variant="outline">{t("recently_viewed.explore")}</Button>
          </Link>
        }
      />
    </div>
  );
};

export default RecentlyViewed;
