
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["alici", "satici","admin"], default: "satici" },
  avatar: { type: String, required: false },
  status: { type: Boolean, default: true },
  province: { type: String, required: false },
  district: { type: String, required: false },
  lastSeen: { type: Date },
isOnline: { type: Boolean, default: false },
  organic:{type:String, required:false},
  organicStatus:{type:Boolean, default:false},
  dogrulanmisSatici:{type:Boolean,default:false},
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
