/**
 * BottomBanner — trust / value props section on Home.
 * Fully localized for Arabic & multi-language.
 */
import { Truck, Leaf, BadgeDollarSign, ShieldCheck } from "lucide-react";
import { assets } from "../assets/assets";
import { SectionHeader, Card } from "./ui";
import { useLanguage } from "../context/LanguageContext";

const BottomBanner = () => {
  const { t } = useLanguage();

  const trustItems = [
    { icon: Truck, titleKey: "home.trust_delivery_title", descKey: "home.trust_delivery_desc" },
    { icon: Leaf, titleKey: "home.trust_fresh_title", descKey: "home.trust_fresh_desc" },
    { icon: BadgeDollarSign, titleKey: "home.trust_price_title", descKey: "home.trust_price_desc" },
    { icon: ShieldCheck, titleKey: "home.trust_families_title", descKey: "home.trust_families_desc" },
  ];

  return (
    <section className="mt-16 md:mt-24">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative overflow-hidden rounded-[24px] shadow-md ring-1 ring-border/40 bg-bg-white">
          <img
            src={assets.bottom_banner_image}
            alt={t("home.bottom_banner_title")}
            className="hidden md:block w-full h-[420px] object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
          />
          <img
            src={assets.bottom_banner_image_sm}
            alt={t("home.bottom_banner_title")}
            className="md:hidden w-full h-64 object-cover object-center"
          />
        </div>

        <div>
          <SectionHeader
            eyebrow={t("home.why_yna")}
            title={t("home.bottom_banner_title")}
            subtitle={t("home.bottom_banner_subtitle")}
            className="mb-6"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {trustItems.map((item) => (
              <Card key={item.titleKey} className="p-4!" hover>
                <div className="w-10 h-10 rounded-[14px] bg-bg-light-mint text-primary flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading font-semibold text-text-primary text-sm">{t(item.titleKey)}</h3>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">{t(item.descKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomBanner;
