import mongoose from "mongoose";

export const USER_ROLES = ["alici", "satici", "admin"];
export const SELF_ASSIGNABLE_ROLES = ["alici", "satici"];

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
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    lastSeen: { type: Date },
    isOnline: { type: Boolean, default: false },
    organic: { type: String },
    organicStatus: { type: Boolean, default: false },
    dogrulanmisSatici: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: { transform: hideSensitiveFields },
    toObject: { transform: hideSensitiveFields },
  }
);

export default mongoose.model("User", userSchema);
