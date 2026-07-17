/**
 * Chat controller — validates messages, injects product catalog, calls Groq.
 * Used by chatRoute at POST /api/chat.
 */
import Product from "../models/Product.js";
import { getGroqClient } from "../configs/groq.js";
import { buildCatalogText, MAX_CATALOG_ITEMS } from "../utils/chatCatalog.js";
import { buildSystemPrompt } from "../utils/chatSystemPrompt.js";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 12;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

const sanitizeHistory = (history) => {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item) =>
        item &&
        ALLOWED_ROLES.has(item.role) &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((item) => ({
      role: item.role,
      content: String(item.content).trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
};

export const chat = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "Chat is not configured. Missing GROQ_API_KEY.",
      });
    }

    const rawMessage = req.body?.message;
    if (typeof rawMessage !== "string" || !rawMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const message = rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH);
    const history = sanitizeHistory(req.body?.history);

    const products = await Product.find({ inStock: true })
      .select("name category price offerPrice weight")
      .limit(MAX_CATALOG_ITEMS)
      .lean();

    const catalogText = buildCatalogText(products);
    const systemPrompt = buildSystemPrompt(catalogText);

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await getGroqClient().chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      messages,
      temperature: 0.4,
      max_tokens: 800,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "No reply from the assistant. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat error:", error);
    const status = error?.status === 429 ? 429 : 500;
    return res.status(status).json({
      success: false,
      message:
        status === 429
          ? "Too many requests. Please wait a moment and try again."
          : "Failed to get a reply. Please try again.",
    });
  }
};
