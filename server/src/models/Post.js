import mongoose from "mongoose";
import { POST_CATEGORIES, RULES } from "../validators/rules.js";

export { POST_CATEGORIES };

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: RULES.postTitle.max },
    description: { type: String, trim: true, maxlength: RULES.postDescription.max },
    images: { type: [String], default: [] },
    province: { type: String, trim: true, index: true },
    district: { type: String, trim: true, index: true },
    category: { type: String, enum: POST_CATEGORIES, required: true, index: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0, min: 0 },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savesCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1, _id: -1 });
postSchema.index({ user: 1, createdAt: -1, _id: -1 });
postSchema.index({ savedBy: 1, createdAt: -1 });
postSchema.index({ title: "text" });
postSchema.index({ category: 1, district: 1 });
postSchema.index({ category: 1, province: 1 });

export default mongoose.model("Post", postSchema);
