/**
 * Terms — terms of service content page.
 * Route: /terms
 */
import { SectionHeader, Card } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
      <SectionHeader eyebrow={t("terms.eyebrow")} title={t("terms.title")} subtitle={t("terms.subtitle")} />
      <Card className="p-6! md:p-8! space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{t("terms.p1")}</p>
        <p>{t("terms.p2")}</p>
        <p>{t("terms.p3")}</p>
        <p>{t("terms.p4")}</p>
        <p className="text-xs text-text-tertiary pt-2">{t("terms.last_updated")}</p>
      </Card>
    </div>
  );
};

export default Terms;
