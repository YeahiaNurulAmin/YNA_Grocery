/**
 * FAQ — frequently asked questions accordion.
 * Route: /faq
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, SectionHeader } from "../components/ui";
import { useLanguage } from "../context/LanguageContext";

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
      <SectionHeader
        eyebrow={t("faq.eyebrow")}
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
      />
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <Card key={i} className="p-0! overflow-hidden" padding={false}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <span className="font-heading font-semibold text-text-primary text-sm md:text-base">
                {item.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-tertiary shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed animate-fade-in">
                {item.a}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
