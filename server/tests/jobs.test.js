import { describe, expect, it } from "vitest";
import Job from "../src/models/Job.js";
import {
  drainJobs,
  enqueueJob,
  processNextJob,
  registerJobHandler,
  releaseStaleJobs,
  startJobWorker,
} from "../src/jobs/queue.js";

describe("iş kuyruğu", () => {
  it("başarılı işi tamamlar", async () => {
    const received = [];
    registerJobHandler("test:ok", async (payload) => received.push(payload.value));

    await enqueueJob("test:ok", { value: 42 });
    await drainJobs();

    expect(received).toEqual([42]);
    expect((await Job.findOne({ type: "test:ok" }).lean()).status).toBe("done");
  });

  it("başarısız işi geri çekilmeyle tekrar dener ve sınırda başarısız sayar", async () => {
    registerJobHandler("test:fail", async () => {
      throw new Error("patladı");
    });

    const job = await enqueueJob("test:fail", {});
    await Job.updateOne({ _id: job._id }, { maxAttempts: 2 });

    await processNextJob();
    const retried = await Job.findById(job._id).lean();
    expect(retried).toMatchObject({ status: "pending", attempts: 1, lastError: "patladı" });
    expect(retried.runAt.getTime()).toBeGreaterThan(Date.now());

    await Job.updateOne({ _id: job._id }, { runAt: new Date() });
    await processNextJob();
    expect((await Job.findById(job._id).lean()).status).toBe("failed");
  });

  it("tanımsız iş tipi başarısız olur ve kuyruğu kilitlemez", async () => {
    const job = await enqueueJob("test:unknown", {});
    await Job.updateOne({ _id: job._id }, { maxAttempts: 1 });

    await drainJobs();
    expect((await Job.findById(job._id).lean()).status).toBe("failed");
  });

  it("takılı kalan işleri serbest bırakır", async () => {
    const job = await Job.create({ type: "test:ok", status: "running", lockedAt: new Date(Date.now() - 60 * 60 * 1000) });

    await releaseStaleJobs();
    expect((await Job.findById(job._id).lean()).status).toBe("pending");
  });

  it("worker yeni işi hemen işler ve temiz kapanır", async () => {
    const received = [];
    registerJobHandler("test:worker", async (payload) => received.push(payload.value));

    const stop = startJobWorker({ pollIntervalMs: 20 });
    await enqueueJob("test:worker", { value: "a" });

    await expect.poll(() => received, { timeout: 2000 }).toEqual(["a"]);
    await stop();
  });
});
