import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    postId: { // 🔥 BURASI YOKSA GELMEZ
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    type: {
      type: String,
      enum: ["new_post"],
      required: true
    },

    province: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    surname: {
      type: String
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Notification", notificationSchema);