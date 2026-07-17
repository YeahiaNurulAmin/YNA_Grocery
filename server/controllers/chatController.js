/**
 * Chat controller — customer chat + seller system-prompt management.
 * Used by chatRoute at POST /api/chat and GET/PUT/POST /api/chat/prompt.
 */
import { getGroqClient } from "../configs/groq.js";
import { loadCatalogForMessage } from "../utils/chatCatalog.js";
import {
  buildSystemPrompt,
  DEFAULT_SYSTEM_PROMPT,
} from "../utils/chatSystemPrompt.js";
import {
  getSystemPromptBase,
  saveSystemPromptBase,
  MAX_PROMPT_LENGTH,
} from "../utils/chatSettings.js";

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

    const [catalogText, promptBase] = await Promise.all([
      loadCatalogForMessage(message),
      getSystemPromptBase(),
    ]);

    const systemPrompt = buildSystemPrompt(catalogText, promptBase);

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

/** GET /api/chat/prompt — seller only */
export const getChatPrompt = async (req, res) => {
  try {
    const systemPrompt = await getSystemPromptBase();
    return res.status(200).json({
      success: true,
      systemPrompt,
      defaultPrompt: DEFAULT_SYSTEM_PROMPT,
      maxLength: MAX_PROMPT_LENGTH,
    });
  } catch (error) {
    console.error("Get chat prompt error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chat prompt.",
    });
  }
};

/** PUT /api/chat/prompt — seller only */
export const updateChatPrompt = async (req, res) => {
  try {
    const raw = req.body?.systemPrompt;
    if (typeof raw !== "string" || !raw.trim()) {
      return res.status(400).json({
        success: false,
        message: "systemPrompt is required.",
      });
    }

    const systemPrompt = raw.trim().slice(0, MAX_PROMPT_LENGTH);
    const saved = await saveSystemPromptBase(systemPrompt);

    return res.status(200).json({
      success: true,
      message: "Chat prompt updated successfully.",
      systemPrompt: saved.systemPrompt,
      updatedAt: saved.updatedAt,
    });
  } catch (error) {
    console.error("Update chat prompt error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update chat prompt.",
    });
  }
};

/** POST /api/chat/prompt/reset — seller only */
export const resetChatPrompt = async (req, res) => {
  try {
    const saved = await saveSystemPromptBase(DEFAULT_SYSTEM_PROMPT);
    return res.status(200).json({
      success: true,
      message: "Chat prompt reset to default.",
      systemPrompt: saved.systemPrompt,
      updatedAt: saved.updatedAt,
    });
  } catch (error) {
    console.error("Reset chat prompt error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset chat prompt.",
    });
  }
};
