/**
 * Chat routes — customer storefront chatbot + seller prompt management.
 * Mounted at /api/chat in server.js.
 */
import express from "express";
import {
  chat,
  getChatPrompt,
  updateChatPrompt,
  resetChatPrompt,
} from "../controllers/chatController.js";
import authSeller from "../middlewares/authSeller.js";
import { chatAbuseGuard } from "../middlewares/chatAbuseGuard.js";

const chatRouter = express.Router();

// POST /api/chat — public customer chat (rate limit + concurrency cap)
chatRouter.post("/", chatAbuseGuard, chat);

// Seller: manage system prompt base
chatRouter.get("/prompt", authSeller, getChatPrompt);
chatRouter.put("/prompt", authSeller, updateChatPrompt);
chatRouter.post("/prompt/reset", authSeller, resetChatPrompt);

export default chatRouter;
