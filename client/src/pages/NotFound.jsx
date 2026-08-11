/**
 * NotFound — 404 page for unknown customer routes.
 * Route: *
 */
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button, EmptyState } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="py-20 mb-nav">
      <EmptyState
        icon={Compass}
        title={t("notfound.title")}
        description={t("notfound.desc")}
        action={
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link to="/">{t("notfound.go_home")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products">{t("notfound.shop")}</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFound;
