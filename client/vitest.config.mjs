import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react({ include: /\.js$/ })],
  resolve: {
    alias: { "@": path.resolve(rootDir, "src") },
  },
  oxc: {
    include: /\.js$/,
    jsx: { runtime: "automatic" },
    lang: "jsx",
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.js"],
    css: false,
    env: {
      REACT_APP_SERVER_URL: "http://localhost:5346",
    },
  },
});
