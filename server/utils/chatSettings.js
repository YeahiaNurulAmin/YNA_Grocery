/**
 * Chat settings helpers — load/save the seller-editable system prompt base.
 * Used by chatController and chatController prompt management endpoints.
 */
import ChatSettings from "../models/ChatSettings.js";
import { DEFAULT_SYSTEM_PROMPT } from "./chatSystemPrompt.js";

const SETTINGS_KEY = "default";
export const MAX_PROMPT_LENGTH = 8000;

/**
 * Returns the stored prompt base via an atomic upsert (singleton-safe).
 * Sets DEFAULT_SYSTEM_PROMPT only on insert.
 * @returns {Promise<string>}
 */
export const getSystemPromptBase = async () => {
  const settings = await ChatSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { systemPrompt: DEFAULT_SYSTEM_PROMPT } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).lean();

  return settings?.systemPrompt || DEFAULT_SYSTEM_PROMPT;
};

/**
 * Upserts the prompt base for the singleton settings document.
 * @param {string} systemPrompt
 * @returns {Promise<{ systemPrompt: string, updatedAt?: Date }>}
 */
export const saveSystemPromptBase = async (systemPrompt) => {
  const settings = await ChatSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { systemPrompt },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).lean();

  return {
    systemPrompt: settings.systemPrompt,
    updatedAt: settings.updatedAt,
  };
};
