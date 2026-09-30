import { describe, expect, it } from "vitest";
import { createMemoryPresence, createRedisPresence } from "../src/sockets/presence.js";

const createFakeRedis = () => {
  const hashes = new Map();
  const hash = (key) => hashes.get(key) ?? hashes.set(key, new Map()).get(key);

  return {
    async hIncrBy(key, field, delta) {
      const next = (hash(key).get(field) ?? 0) + delta;
      hash(key).set(field, next);
      return next;
    },
    async hDel(key, field) {
      hash(key).delete(field);
    },
    async hKeys(key) {
      return [...hash(key).keys()];
    },
    async del(key) {
      hashes.delete(key);
    },
  };
};

describe.each([
  ["bellek", () => createMemoryPresence()],
  ["redis", () => createRedisPresence(createFakeRedis())],
])("%s presence deposu", (name, createPresence) => {
  it("ilk bağlantıda çevrimiçi, son bağlantı kapanınca çevrimdışı olur", async () => {
    const presence = createPresence();

    expect(await presence.connect("u1")).toBe(true);
    expect(await presence.connect("u1")).toBe(false);
    expect(await presence.list()).toEqual(["u1"]);

    expect(await presence.disconnect("u1")).toBe(false);
    expect(await presence.disconnect("u1")).toBe(true);
    expect(await presence.list()).toEqual([]);
  });

  it("sıfırlanınca tüm kayıtlar silinir", async () => {
    const presence = createPresence();
    await presence.connect("u1");
    await presence.connect("u2");

    await presence.reset();
    expect(await presence.list()).toEqual([]);
  });
});
