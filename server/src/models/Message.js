import mongoose from "mongoose";
import { RULES } from "../validators/rules.js";

export const MESSAGE_MAX_LENGTH = RULES.message.max;

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: MESSAGE_MAX_LENGTH },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1, _id: -1 });
messageSchema.index({ receiverId: 1, readAt: 1, conversationId: 1 });

export default mongoose.model("Message", messageSchema);
