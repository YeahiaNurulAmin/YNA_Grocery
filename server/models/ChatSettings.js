/**
 * ChatSettings — singleton store for the customer chatbot system prompt base.
 * Used by chatController (runtime) and seller chat prompt APIs.
 */
import mongoose from "mongoose";

const chatSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    systemPrompt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatSettings =
  mongoose.models.ChatSettings ||
  mongoose.model("ChatSettings", chatSettingsSchema);

export default ChatSettings;
