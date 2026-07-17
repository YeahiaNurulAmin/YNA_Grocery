/**
 * Groq client singleton for LLM chat completions.
 * Used by chatController to call openai/gpt-oss-20b (or GROQ_MODEL).
 * Lazily created so the server can boot without GROQ_API_KEY.
 */
import Groq from "groq-sdk";

let groqClient = null;

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
};

export default getGroqClient;
