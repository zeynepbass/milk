import mongoose from "mongoose";

export const APPLICATION_STATUSES = ["pending", "approved", "rejected"];

const organicApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    documentKey: { type: String, required: true },
    originalName: { type: String, trim: true, maxlength: 200 },
    status: { type: String, enum: APPLICATION_STATUSES, default: "pending" },
    note: { type: String, trim: true, maxlength: 500 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

organicApplicationSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { status: "pending" }, name: "one_pending_per_user" }
);
organicApplicationSchema.index({ status: 1, createdAt: -1, _id: -1 });

export default mongoose.model("OrganicApplication", organicApplicationSchema);
