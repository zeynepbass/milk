import fs from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath) => fs.readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("paylaşılan doğrulama kuralları", () => {
  it("client ve server aynı kural dosyasını kullanır", () => {
    expect(read("../../client/src/shared/validation/rules.js")).toBe(read("../src/validators/rules.js"));
  });
});
