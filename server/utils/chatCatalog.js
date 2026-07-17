/**
 * Builds a compact, message-relevant product catalog for the chatbot system prompt.
 * Used by chatController when injecting live in-stock products into Groq requests.
 */
import Product from "../models/Product.js";

const MAX_CATALOG_ITEMS = 80;

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "had",
  "her",
  "was",
  "one",
  "our",
  "out",
  "has",
  "have",
  "been",
  "some",
  "what",
  "when",
  "where",
  "which",
  "who",
  "will",
  "with",
  "this",
  "that",
  "from",
  "they",
  "them",
  "your",
  "about",
  "into",
  "than",
  "then",
  "there",
  "these",
  "those",
  "please",
  "thanks",
  "thank",
  "hello",
  "hi",
  "hey",
  "need",
  "want",
  "like",
  "looking",
  "show",
  "find",
  "get",
  "buy",
  "any",
  "how",
  "much",
  "many",
  "under",
  "over",
  "price",
  "cost",
  "delivery",
  "payment",
  "order",
  "help",
]);

/**
 * Formats product documents into short catalog lines for the LLM.
 * @param {Array<{ name: string, category: string, price: number, offerPrice?: number, weight?: string }>} products
 * @returns {string}
 */
export const buildCatalogText = (products = []) => {
  const items = products.slice(0, MAX_CATALOG_ITEMS);

  if (items.length === 0) {
    return "No products currently in stock.";
  }

  return items
    .map((p) => {
      const price = Number(p.price);
      const offer = p.offerPrice != null ? Number(p.offerPrice) : null;
      const pricePart =
        offer != null && !Number.isNaN(offer) && offer < price
          ? `$${price.toFixed(2)} (offer $${offer.toFixed(2)})`
          : `$${price.toFixed(2)}`;
      const weight = p.weight ? ` | ${p.weight}` : "";
      return `${p.name} | ${p.category} | ${pricePart}${weight}`;
    })
    .join("\n");
};

const extractSearchTokens = (message = "") =>
  message
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
    .slice(0, 8);

/**
 * Loads in-stock products relevant to the customer message, then fills remaining
 * slots. Annotates when the snapshot is incomplete so the model does not treat
 * it as the full inventory.
 * @param {string} message
 * @returns {Promise<string>}
 */
export const loadCatalogForMessage = async (message) => {
  const select = "name category price offerPrice weight";
  const totalInStock = await Product.countDocuments({ inStock: true });
  const tokens = extractSearchTokens(message);

  let matched = [];
  if (tokens.length > 0) {
    const or = tokens.flatMap((token) => {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return [
        { name: { $regex: escaped, $options: "i" } },
        { category: { $regex: escaped, $options: "i" } },
      ];
    });

    matched = await Product.find({ inStock: true, $or: or })
      .select(select)
      .limit(MAX_CATALOG_ITEMS)
      .lean();
  }

  const remaining = MAX_CATALOG_ITEMS - matched.length;
  let filler = [];
  if (remaining > 0) {
    const excludeIds = matched.map((p) => p._id);
    filler = await Product.find({
      inStock: true,
      ...(excludeIds.length ? { _id: { $nin: excludeIds } } : {}),
    })
      .select(select)
      .limit(remaining)
      .lean();
  }

  const products = [...matched, ...filler];
  let catalogText = buildCatalogText(products);

  if (totalInStock > products.length) {
    catalogText += `

CATALOG NOTE: Showing ${products.length} of ${totalInStock} in-stock products (message-relevant matches first). This is NOT a complete inventory. If a customer asks about a product not listed above, do not invent availability — say it is not in this snapshot and suggest browsing /products, searching the store, or asking again with the exact product or category name.`;
  }

  return catalogText;
};

export { MAX_CATALOG_ITEMS };
