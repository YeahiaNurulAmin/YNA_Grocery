/**
 * LanguageContext — manages language state, RTL direction, interpolation & currency formatting.
 * Persisted in localStorage under "yna_lang".
 * Fully extensible for adding any new languages in the future.
 */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { translations, SUPPORTED_LANGUAGES, getCategoryTranslation } from "../locales";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("yna_lang") || "en"
  );

  const currentLangObj = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );

  const isRTL = currentLangObj.dir === "rtl";

  // Apply dir + lang attribute + font imports whenever language changes
  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", currentLangObj.dir);
    document.documentElement.classList.toggle("rtl", isRTL);

    if (isRTL) {
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
  }, [language, currentLangObj.dir, isRTL]);

  /** Translate a key with optional interpolation params e.g. { count: 5 } */
  const t = useCallback(
    (key, params) => {
      let text = translations[language]?.[key] ?? translations["en"]?.[key] ?? key;
      if (params && typeof params === "object") {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.split(`{${paramKey}}`).join(String(paramVal));
        });
      }
      return text;
    },
    [language]
  );

  /** Translate category names or paths */
  const tCategory = useCallback(
    (catInput) => getCategoryTranslation(catInput, language),
    [language]
  );

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));

  const currencySymbol = currentLangObj.currency || (language === "ar" ? "ر.س" : "$");

  /** Format price with appropriate currency symbol */
  const formatPrice = useCallback(
    (amount, baseCurrency) => {
      const num = Number(amount) || 0;
      const symbol = baseCurrency || currencySymbol;
      if (language === "ar") {
        return `${num.toFixed(2)} ${symbol}`;
      }
      return `${symbol}${num.toFixed(2)}`;
    },
    [language, currencySymbol]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        tCategory,
        isRTL,
        dir: currentLangObj.dir,
        currencySymbol,
        formatPrice,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguage: currentLangObj,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
