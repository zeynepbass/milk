import { describe, expect, it, vi } from "vitest";
import User from "../src/models/User.js";
import { errorHandler } from "../src/middleware/errorHandler.js";
import { stripOperatorKeys } from "../src/middleware/sanitize.js";
import { api, createSession, registerUser } from "./helpers.js";

describe("girdi doğrulama", () => {
  it("geçersiz kimlikler 400 döner", async () => {
    const { auth } = await createSession();
    const response = await api().delete("/api/posts/gecersiz").set(auth);

    expect(response.status).toBe(400);
    expect(response.body.details[0]).toMatchObject({ location: "params", path: "id" });
  });

  it("login'de operatör enjeksiyonu çalışmaz", async () => {
    await registerUser({ email: "hedef@ornek.com" });

    const response = await api()
      .post("/api/auth/login")
      .send({ email: { $ne: null }, password: { $ne: null } });

    expect(response.status).toBe(400);
  });

  it("çok büyük JSON gövdesini reddeder", async () => {
    const response = await api()
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ email: "a@b.co", password: "x".repeat(200 * 1024) }));

    expect(response.status).toBe(413);
  });

  it("gönderi listesinde geçersiz kategori 400 döner", async () => {
    const { auth } = await createSession();
    const response = await api().get("/api/posts?category=silah").set(auth);

    expect(response.status).toBe(400);
  });

  it("token olmadan korumalı uçlara erişilemez", async () => {
    const response = await api().get("/api/users/me");

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("TOKEN_MISSING");
  });

  it("bozuk token 401 döner", async () => {
    const response = await api().get("/api/users/me").set("Authorization", "Bearer bozuk.token.degeri");

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("TOKEN_INVALID");
  });

  it("silinmiş kullanıcının token'ı reddedilir", async () => {
    const { user, auth } = await createSession();
    await User.deleteOne({ _id: user._id });

    const response = await api().get("/api/users/me").set(auth);
    expect(response.status).toBe(401);
  });
});

describe("sanitize", () => {
  it("$ ve nokta içeren anahtarları temizler", () => {
    expect(
      stripOperatorKeys({ a: 1, $where: "x", "b.c": 2, nested: { $gt: 1, ok: [{ $ne: 1, y: 2 }] } })
    ).toEqual({
      a: 1,
      nested: { ok: [{ y: 2 }] },
    });
  });
});

describe("hata yakalayıcı", () => {
  it("beklenmeyen hatalarda iç mesajı sızdırmaz", () => {
    const res = { headersSent: false, status: vi.fn().mockReturnThis(), json: vi.fn() };
    const req = { id: "istek-1", log: { error: vi.fn() } };

    errorHandler(new Error("connection string mongodb://kullanici:sifre@db"), req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sunucu hatası",
      code: "INTERNAL_ERROR",
      requestId: "istek-1",
    });
    expect(req.log.error).toHaveBeenCalled();
  });
});

describe("sağlık kontrolü", () => {
  it("/health 200 döner", async () => {
    const response = await api().get("/health");
    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toEqual(expect.any(String));
  });
});
