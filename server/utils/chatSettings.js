/**
 * Chat settings helpers — load/save the seller-editable system prompt base.
 * Used by chatController and chatController prompt management endpoints.
 */
import ChatSettings from "../models/ChatSettings.js";
import { DEFAULT_SYSTEM_PROMPT } from "./chatSystemPrompt.js";

const SETTINGS_KEY = "default";
export const MAX_PROMPT_LENGTH = 8000;

/**
 * Returns the stored prompt base, creating a default document if missing.
 * @returns {Promise<string>}
 */
export const getSystemPromptBase = async () => {
  let settings = await ChatSettings.findOne({ key: SETTINGS_KEY }).lean();

  if (!settings) {
    settings = await ChatSettings.create({
      key: SETTINGS_KEY,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
    });
    return settings.systemPrompt;
  }

  return settings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
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
