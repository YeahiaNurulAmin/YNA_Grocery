/**
 * Locales Registry & Helper Utilities
 * Modular i18n structure — makes it effortless to register new languages in the future.
 */
import { en } from "./en";
import { ar } from "./ar";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr", flag: "🇺🇸", currency: "$" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", flag: "🇸🇦", currency: "ر.س" },
];

export const translations = {
  en,
  ar,
};

/** Category mappings for standard category names across languages */
const categoryMap = {
  vegetables: { en: "Vegetables", ar: "خضروات" },
  organicveggies: { en: "Organic veggies", ar: "خضروات عضوية" },
  fruits: { en: "Fruits", ar: "فواكه" },
  freshfruits: { en: "Fresh Fruits", ar: "فواكه طازجة" },
  drinks: { en: "Cold Drinks", ar: "مشروبات باردة" },
  colddrinks: { en: "Cold Drinks", ar: "مشروبات باردة" },
  instant: { en: "Instant Food", ar: "أطعمة سريعة" },
  instantfood: { en: "Instant Food", ar: "أطعمة سريعة" },
  dairy: { en: "Dairy Products", ar: "منتجات الألبان" },
  dairyproducts: { en: "Dairy Products", ar: "منتجات الألبان" },
  bakery: { en: "Bakery & Breads", ar: "مخبوزات وتوست" },
  bakerybreads: { en: "Bakery & Breads", ar: "مخبوزات وتوست" },
  grains: { en: "Grains & Cereals", ar: "حبوب وغلال" },
  grainscereals: { en: "Grains & Cereals", ar: "حبوب وغلال" },
  beverages: { en: "Beverages", ar: "مشروبات" },
  freshproduce: { en: "Fresh Produce", ar: "خضار وفواكه طازجة" },
  dairyeggs: { en: "Dairy & Eggs", ar: "ألبان وبيض" },
  snacks: { en: "Snacks", ar: "تسالي ومقرمشات" },
  meatseafood: { en: "Meat & Seafood", ar: "لحوم وأسماك" },
  pantrystaples: { en: "Pantry & Staples", ar: "مؤونة ومواد غذائية" },
};

/** Translate category name or path */
export const getCategoryTranslation = (catInput, lang = "en") => {
  if (!catInput) return "";
  const key = String(catInput).toLowerCase().replace(/[^a-z0-9]/g, "");
  if (categoryMap[key] && categoryMap[key][lang]) {
    return categoryMap[key][lang];
  }
  return catInput;
};
