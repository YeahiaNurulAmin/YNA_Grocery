/**
 * LanguageContext — manages language (en/ar) + RTL direction.
 * Persisted in localStorage under "yna_lang".
 * Exposes a `t(key)` helper consumed across all components.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("yna_lang") || "en"
  );

  // Apply dir + lang attribute + Arabic font import whenever language changes
  useEffect(() => {
    const isArabic = language === "ar";
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", isArabic ? "rtl" : "ltr");
    document.documentElement.classList.toggle("rtl", isArabic);

    // Inject Arabic font on demand
    if (isArabic) {
      if (!document.getElementById("arabic-font-link")) {
        const link = document.createElement("link");
        link.id = "arabic-font-link";
        link.rel = "stylesheet";
        link.href =
          "https://fonts.googleapis.com/css2?family=Cairo:wght@300..700&family=Noto+Sans+Arabic:wght@300..700&display=swap";
        document.head.appendChild(link);
      }
    }

    localStorage.setItem("yna_lang", language);
  }, [language]);

  /** Translate a key. Falls back to English, then the key itself. */
  const t = useCallback(
    (key) =>
      translations[language]?.[key] ?? translations["en"]?.[key] ?? key,
    [language]
  );

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));

  const isRTL = language === "ar";

  const currencySymbol = language === "ar" ? "ر.س" : "$";

  /** Format amount with currency symbol based on active language */
  const formatPrice = useCallback(
    (amount, baseCurrency = "$") => {
      const num = Number(amount) || 0;
      if (language === "ar") {
        return `${num.toFixed(2)} ر.س`;
      }
      return `${baseCurrency}${num.toFixed(2)}`;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t, isRTL, currencySymbol, formatPrice }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
