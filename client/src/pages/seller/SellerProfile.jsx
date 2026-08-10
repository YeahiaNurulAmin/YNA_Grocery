/**
 * SellerProfile — UI-only admin profile card.
 * Route: /seller/profile
 */
import { Card, SectionHeader, Badge } from "../../components/ui";
import { User } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const SellerProfile = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in max-w-xl">
      <SectionHeader eyebrow={t("seller.account_section")} title={t("seller.profile_title")} subtitle={t("seller.profile_subtitle")} />
      <Card className="p-6!">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-[20px] bg-primary/15 text-primary flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold">{t("seller.hi_admin").split(" ")[1] || "Admin"}</h3>
            <p className="text-sm text-text-secondary">YNA Grocery {t("seller.hi_admin").split(" ")[1] || "Seller"}</p>
            <Badge variant="success" className="mt-2">{t("product.in_stock")}</Badge>
          </div>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-text-tertiary">{t("seller.hi_admin").split(" ")[1] || "Role"}</dt>
            <dd className="font-medium">Seller / Admin</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-text-tertiary">{t("seller.store_section")}</dt>
            <dd className="font-medium">{t("seller.products_list")}, {t("seller.orders_list")}, {t("seller.coupons")}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-tertiary">{t("seller.settings")}</dt>
            <dd className="font-medium">Env credentials · JWT cookie</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
};

export default SellerProfile;
