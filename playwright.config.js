import { defineConfig, devices } from "@playwright/test";

const CLIENT_PORT = 3100;
const API_PORT = 5400;

export default defineConfig({
  testDir: "./e2e",
  timeout: 90 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${CLIENT_PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node e2e/support/start-api.mjs",
      url: `http://localhost:${API_PORT}/health`,
      env: { E2E_API_PORT: String(API_PORT), E2E_CLIENT_URL: `http://localhost:${CLIENT_PORT}` },
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: "npm --prefix client start",
      url: `http://localhost:${CLIENT_PORT}`,
      env: {
        PORT: String(CLIENT_PORT),
        BROWSER: "none",
        REACT_APP_SERVER_URL: `http://localhost:${API_PORT}`,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
    },
  ],
});
