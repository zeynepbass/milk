import mongoose from "mongoose";
import { ROLES, SELF_ASSIGNABLE_ROLES } from "../validators/rules.js";

export const USER_ROLES = ROLES;
export { SELF_ASSIGNABLE_ROLES };

const hideSensitiveFields = (doc, ret) => {
  delete ret.password;
  delete ret.passwordChangedAt;
  delete ret.__v;
  return ret;
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    surname: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    passwordChangedAt: { type: Date, select: false },
    role: { type: String, enum: USER_ROLES, default: "satici" },
    avatar: { type: String },
    status: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null, index: true },
    province: { type: String, trim: true, index: true },
    district: { type: String, trim: true },
    lastSeen: { type: Date },
    organic: { type: String },
    organicStatus: { type: Boolean, default: false },
    dogrulanmisSatici: { type: Boolean, default: false },
    followersCount: { type: Number, default: 0, min: 0 },
    followingCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { transform: hideSensitiveFields },
    toObject: { transform: hideSensitiveFields },
  }
);

export default mongoose.model("User", userSchema);
