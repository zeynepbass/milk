import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // 🔥 ürün bazlı konuşma (çok önemli senin senaryoda)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },

    // 💬 son mesaj (liste performansı için)
    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);