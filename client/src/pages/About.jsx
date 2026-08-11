/**
 * About — brand story page.
 * Route: /about
 */
import { Leaf, Heart, Truck } from "lucide-react";
import { Card, SectionHeader } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const cards = [
    { icon: Leaf, titleKey: "about.fresh_title", textKey: "about.fresh_text" },
    { icon: Heart, titleKey: "about.family_title", textKey: "about.family_text" },
    { icon: Truck, titleKey: "about.delivery_title", textKey: "about.delivery_text" },
  ];

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-4xl mx-auto">
      <SectionHeader
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />
      <Card className="p-8! mb-8 gradient-fresh border-primary/10">
        <p className="text-text-secondary leading-relaxed">
          {t("about.mission")}
        </p>
      </Card>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({ icon: Icon, titleKey, textKey }) => (
          <Card key={titleKey} className="p-5!" hover>
            <div className="w-10 h-10 rounded-[14px] bg-bg-light-mint text-primary flex items-center justify-center mb-3">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-text-primary">{t(titleKey)}</h3>
            <p className="text-sm text-text-secondary mt-1">{t(textKey)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default About;
