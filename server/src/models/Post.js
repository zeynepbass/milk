import mongoose from "mongoose";

export const POST_CATEGORIES = ["sut_urunleri", "bal", "zeytinyagi", "peynir", "sebze", "meyve"];

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerSurname: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
    },

    ownerRole: {
      type: String,
      enum: ["satici", "alici"],
      lowercase: true,
      trim: true,
      default: "alici",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    images: [String],

    province: {
      type: String,
      trim: true,
      index: true,
    },

    district: {
      type: String,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      enum: POST_CATEGORIES,
      required: true,
      index: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

postSchema.index({ title: "text" });
postSchema.index({ category: 1, district: 1 });
postSchema.index({ category: 1, province: 1 });

export default mongoose.model("Post", postSchema);
