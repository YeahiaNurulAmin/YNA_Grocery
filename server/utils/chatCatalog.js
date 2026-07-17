/**
 * Builds a compact product catalog string for the chatbot system prompt.
 * Used by chatController when injecting live in-stock products into Groq requests.
 */

const MAX_CATALOG_ITEMS = 80;

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

export { MAX_CATALOG_ITEMS };
