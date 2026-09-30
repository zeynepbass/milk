import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./server";
import { useAuthStore } from "@/shared/store/useAuthStore";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  useAuthStore.setState({ status: "anonymous", accessToken: null, userId: null });
});

afterAll(() => server.close());
