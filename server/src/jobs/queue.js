import Job from "../models/Job.js";
import { logger } from "../utils/logger.js";

const STALE_LOCK_MS = 5 * 60 * 1000;
const MAX_BACKOFF_MS = 5 * 60 * 1000;

const handlers = new Map();
let wakeWorker = null;

export const registerJobHandler = (type, handler) => {
  handlers.set(type, handler);
};

export const enqueueJob = async (type, payload, { session, runAt } = {}) => {
  const [job] = await Job.create([{ type, payload, runAt: runAt ?? new Date() }], { session });
  wakeWorker?.();
  return job;
};

const backoffDelay = (attempts) => Math.min(1000 * 2 ** attempts, MAX_BACKOFF_MS);

const claimNextJob = () =>
  Job.findOneAndUpdate(
    { status: "pending", runAt: { $lte: new Date() } },
    { $set: { status: "running", lockedAt: new Date() }, $inc: { attempts: 1 } },
    { sort: { runAt: 1 }, returnDocument: "after" }
  ).lean();

const completeJob = (job) =>
  Job.updateOne(
    { _id: job._id },
    { $set: { status: "done", lockedAt: null, finishedAt: new Date() }, $unset: { lastError: "" } }
  );

const failJob = (job, err) => {
  const exhausted = job.attempts >= job.maxAttempts;

  return Job.updateOne(
    { _id: job._id },
    {
      $set: exhausted
        ? { status: "failed", lockedAt: null, finishedAt: new Date(), lastError: err.message }
        : {
            status: "pending",
            lockedAt: null,
            runAt: new Date(Date.now() + backoffDelay(job.attempts)),
            lastError: err.message,
          },
    }
  );
};

const runJob = async (job) => {
  const handler = handlers.get(job.type);

  try {
    if (!handler) throw new Error(`Tanımsız iş tipi: ${job.type}`);
    await handler(job.payload);
    await completeJob(job);
  } catch (err) {
    logger.warn(
      { err, jobId: job._id.toString(), type: job.type, attempts: job.attempts },
      "İş başarısız oldu"
    );
    await failJob(job, err);
  }
};

export const processNextJob = async () => {
  const job = await claimNextJob();
  if (!job) return false;

  await runJob(job);
  return true;
};

export const drainJobs = async () => {
  while (await processNextJob()) {
    await Promise.resolve();
  }
};

export const releaseStaleJobs = () =>
  Job.updateMany(
    { status: "running", lockedAt: { $lt: new Date(Date.now() - STALE_LOCK_MS) } },
    { $set: { status: "pending", lockedAt: null } }
  );

export const startJobWorker = ({ pollIntervalMs }) => {
  let stopped = false;
  let timer = null;
  let running = Promise.resolve();

  const tick = async () => {
    if (stopped) return;
    timer = null;

    try {
      await drainJobs();
    } catch (err) {
      logger.error({ err }, "İş kuyruğu işlenemedi");
    }

    if (!stopped) timer = setTimeout(schedule, pollIntervalMs);
  };

  const schedule = () => {
    running = running.then(tick);
  };

  wakeWorker = () => {
    if (stopped || !timer) return;
    clearTimeout(timer);
    timer = null;
    schedule();
  };

  releaseStaleJobs()
    .catch((err) => logger.error({ err }, "Takılı işler serbest bırakılamadı"))
    .finally(schedule);

  return async () => {
    stopped = true;
    wakeWorker = null;
    if (timer) clearTimeout(timer);
    await running;
  };
};
