import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const serverDir = path.resolve(import.meta.dirname, "../../server");
const requireFromServer = createRequire(path.join(serverDir, "package.json"));
const { MongoMemoryReplSet } = requireFromServer("mongodb-memory-server");

const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: "wiredTiger" } });

Object.assign(process.env, {
  NODE_ENV: "development",
  PORT: process.env.E2E_API_PORT ?? "5400",
  MONGO_URI: replSet.getUri("milk-e2e"),
  JWT_SECRET: "e2e-secret-e2e-secret-e2e-secret-e2e",
  CLIENT_URLS: process.env.E2E_CLIENT_URL ?? "http://localhost:3100",
  UPLOAD_DIR: path.join(os.tmpdir(), "milk-e2e-uploads"),
  LOG_LEVEL: "warn",
  JOBS_POLL_INTERVAL_MS: "200",
});

const stop = async () => {
  await replSet.stop();
  process.exit(0);
};

process.once("SIGTERM", stop);
process.once("SIGINT", stop);

await import(pathToFileURL(path.join(serverDir, "src/server.js")).href);
