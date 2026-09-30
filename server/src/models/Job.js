import mongoose from "mongoose";

export const JOB_STATUSES = ["pending", "running", "done", "failed"];

const jobSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: JOB_STATUSES, default: "pending" },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    runAt: { type: Date, default: Date.now },
    lockedAt: { type: Date, default: null },
    lastError: { type: String },
    finishedAt: { type: Date },
  },
  { timestamps: true }
);

jobSchema.index({ status: 1, runAt: 1 });
jobSchema.index({ finishedAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export default mongoose.model("Job", jobSchema);
