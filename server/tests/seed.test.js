import { describe, expect, it } from "vitest";
import Post from "../src/models/Post.js";
import Follow from "../src/models/Follow.js";
import { DEMO_PASSWORD, seed } from "../scripts/seed.js";
import { login } from "./helpers.js";

describe("seed", () => {
  it("demo hesaplarını idempotent olarak oluşturur", async () => {
    await seed();
    await seed();

    expect(await Post.countDocuments()).toBe(4);
    expect(await Follow.countDocuments()).toBe(1);

    for (const email of ["admin@milk.demo", "satici@milk.demo", "alici@milk.demo"]) {
      expect((await login(email, DEMO_PASSWORD)).response.status).toBe(200);
    }
  });
});
