import mongoose from "mongoose";
import { FEEDBACK_TYPES, RULES } from "../validators/rules.js";

export { FEEDBACK_TYPES };

const feedbackSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true, maxlength: RULES.feedback.max },
    type: { type: String, enum: FEEDBACK_TYPES, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
