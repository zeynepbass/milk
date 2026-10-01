import mongoose from "mongoose";

export const NOTIFICATION_TYPES = [
  "new_post",
  "post_like",
  "post_comment",
  "follow",
  "organic_approved",
  "organic_rejected",
];
export const ENTITY_KINDS = ["post", "comment", "user", "organic_application"];

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    entity: {
      kind: { type: String, enum: ENTITY_KINDS, required: true },
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
    groupKey: { type: String, required: true },
    count: { type: Number, default: 1, min: 1 },
    isRead: { type: Boolean, default: false },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, lastActivityAt: -1, _id: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, groupKey: 1, isRead: 1, lastActivityAt: -1 });

export default mongoose.model("Notification", notificationSchema);
