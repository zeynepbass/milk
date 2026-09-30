import os from "node:os";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.js"],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 120000,
    env: {
      NODE_ENV: "test",
      MONGO_URI: "mongodb://placeholder",
      JWT_SECRET: "test-secret-test-secret-test-secret",
      CLIENT_URLS: "http://localhost:3000",
      UPLOAD_DIR: path.join(os.tmpdir(), "milk-test-uploads"),
    },
    coverage: {
      provider: "v8",
      include: ["src/services/**", "src/middleware/**", "src/sockets/**", "src/jobs/**", "src/utils/**"],
      reporter: ["text-summary", "text", "lcov"],
      thresholds: {
        "src/services/**": { statements: 80, branches: 70, functions: 80, lines: 80 },
      },
    },
  },
});
