/**
 * Privacy — privacy policy content page.
 * Route: /privacy
 */
import { SectionHeader, Card } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
      <SectionHeader eyebrow={t("privacy.eyebrow")} title={t("privacy.title")} subtitle={t("privacy.subtitle")} />
      <Card className="p-6! md:p-8! space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{t("privacy.p1")}</p>
        <p>{t("privacy.p2")}</p>
        <p>{t("privacy.p3")}</p>
        <p>{t("privacy.p4")}</p>
        <p className="text-xs text-text-tertiary pt-2">{t("privacy.last_updated")}</p>
      </Card>
    </div>
  );
};

export default Privacy;
