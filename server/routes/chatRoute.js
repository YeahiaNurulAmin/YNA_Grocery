/**
 * Chat routes — customer storefront chatbot API.
 * Mounted at /api/chat in server.js.
 */
import express from "express";
import { chat } from "../controllers/chatController.js";

const chatRouter = express.Router();

// POST /api/chat
chatRouter.post("/", chat);

export default chatRouter;
