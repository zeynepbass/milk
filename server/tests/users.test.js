import { describe, expect, it } from "vitest";
import User from "../src/models/User.js";
import { api, createAdminSession, createSession, PNG_BYTES } from "./helpers.js";

describe("profil güncelleme", () => {
  it.each([
    ["role", "admin"],
    ["status", false],
    ["organicStatus", true],
    ["dogrulanmisSatici", true],
    ["password", "yeni-sifre-123"],
    ["email", "baska@ornek.com"],
    ["followersCount", 1000],
  ])("%s alanının değiştirilmesini reddeder", async (field, value) => {
    const { user, auth } = await createSession();
    const before = await User.findById(user._id).select("+password").lean();

    const response = await api()
      .patch("/api/users/me")
      .set(auth)
      .send({ name: "Yeni", [field]: value });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");

    const after = await User.findById(user._id).select("+password").lean();
    expect(after).toEqual(before);
  });

  it("izinli alanları günceller ve hash sızdırmaz", async () => {
    const { auth } = await createSession();
    const response = await api().patch("/api/users/me").set(auth).send({ name: "Zeynep", province: "İzmir" });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ name: "Zeynep", province: "İzmir" });
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);
  });

  it("/me yanıtında şifre hash'i yoktur ve sayaçlar döner", async () => {
    const { auth } = await createSession();
    const response = await api().get("/api/users/me").set(auth);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ followersCount: 0, followingCount: 0 });
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);
  });
});

describe("e-posta değişikliği", () => {
  it("mevcut şifre olmadan değiştirilemez", async () => {
    const { auth } = await createSession();
    const response = await api().put("/api/users/me/email").set(auth).send({ email: "yeni@ornek.com" });

    expect(response.status).toBe(400);
  });

  it("e-postayı normalize eder", async () => {
    const { user, auth } = await createSession();
    const response = await api()
      .put("/api/users/me/email")
      .set(auth)
      .send({ email: " Yeni@Ornek.COM ", currentPassword: user.password });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("yeni@ornek.com");
  });

  it("başka hesapta kullanılan e-posta için 409 döner", async () => {
    await createSession({ email: "dolu@ornek.com" });
    const { user, auth } = await createSession();

    const response = await api()
      .put("/api/users/me/email")
      .set(auth)
      .send({ email: "DOLU@ornek.com", currentPassword: user.password });

    expect(response.status).toBe(409);
  });
});

describe("avatar yükleme", () => {
  it("PNG avatarı kabul eder ve eskisini değiştirir", async () => {
    const { auth } = await createSession();
    const upload = () =>
      api()
        .put("/api/users/me/avatar")
        .set(auth)
        .attach("avatar", PNG_BYTES, { filename: "avatar.png", contentType: "image/png" });

    const first = await upload();
    const second = await upload();

    expect(first.status).toBe(200);
    expect(second.body.user.avatar).toMatch(/^\/uploads\/[\w-]+\.png$/);
    expect(second.body.user.avatar).not.toBe(first.body.user.avatar);
    expect((await api().get(first.body.user.avatar)).status).toBe(404);
    expect((await api().get(second.body.user.avatar)).status).toBe(200);
  });

  it("SVG dosyasını reddeder", async () => {
    const { auth } = await createSession();
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

    const response = await api()
      .put("/api/users/me/avatar")
      .set(auth)
      .attach("avatar", svg, { filename: "x.svg", contentType: "image/svg+xml" });

    expect(response.status).toBe(400);
  });

  it("MIME tipi PNG görünen ama içeriği farklı olan dosyayı reddeder", async () => {
    const { auth } = await createSession();
    const response = await api()
      .put("/api/users/me/avatar")
      .set(auth)
      .attach("avatar", Buffer.from("<html></html>"), { filename: "x.png", contentType: "image/png" });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("UNSUPPORTED_FILE_TYPE");
  });
});

describe("herkese açık profil", () => {
  it("takip durumunu ve sayaçları döner", async () => {
    const target = await createSession();
    const viewer = await createSession();
    await api().put(`/api/users/${target.user._id}/follow`).set(viewer.auth);

    const response = await api().get(`/api/users/${target.user._id}`).set(viewer.auth);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ isFollowing: true, followersCount: 1 });
    expect(response.body.email).toBeUndefined();
  });
});

describe("admin işlemleri", () => {
  it("normal kullanıcı rol değiştiremez", async () => {
    const target = await createSession();
    const { auth } = await createSession();

    const response = await api().patch(`/api/users/${target.user._id}/role`).set(auth).send({ role: "admin" });
    expect(response.status).toBe(403);
  });

  it("admin rol değiştirebilir ve kullanıcının oturumları kapanır", async () => {
    const target = await createSession({ role: "alici" });
    const admin = await createAdminSession();

    const response = await api()
      .patch(`/api/users/${target.user._id}/role`)
      .set(admin.auth)
      .send({ role: "satici" });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("satici");

    const refresh = await api()
      .post("/api/auth/refresh")
      .set("Origin", "http://localhost:3000")
      .set("Cookie", target.cookie);
    expect(refresh.status).toBe(401);
  });

  it("organik statü onayı doğrulanmış satıcı rozetini verir", async () => {
    const target = await createSession();
    const admin = await createAdminSession();

    const response = await api()
      .put("/api/users/organic-status")
      .set(admin.auth)
      .send({ userId: target.user._id, organicStatus: true });

    expect(response.status).toBe(200);
    expect(response.body.user.dogrulanmisSatici).toBe(true);
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);
  });

  it("kullanıcı listesi sayfalanır ve silinmiş hesapları içermez", async () => {
    const admin = await createAdminSession();
    const removed = await createSession();
    await createSession();
    await api().delete("/api/users/me").set(removed.auth).send({ password: removed.user.password });

    const firstPage = await api().get("/api/users?limit=1").set(admin.auth);
    const secondPage = await api()
      .get(`/api/users?limit=5&cursor=${firstPage.body.nextCursor}`)
      .set(admin.auth);

    const ids = [...firstPage.body.items, ...secondPage.body.items].map((user) => user._id);
    expect(ids).toHaveLength(2);
    expect(ids).not.toContain(removed.user._id);
  });
});

describe("geri bildirim", () => {
  it("geçersiz türü reddeder", async () => {
    const { auth } = await createSession();
    const response = await api().post("/api/users/feedback").set(auth).send({ type: "spam", message: "x" });

    expect(response.status).toBe(400);
  });

  it("admin geri bildirimleri sayfalı görür", async () => {
    const { auth } = await createSession();
    const admin = await createAdminSession();
    await api().post("/api/users/feedback").set(auth).send({ type: "hata", message: "Buton çalışmıyor" });

    const response = await api().get("/api/users/feedback").set(admin.auth);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].user.email).toEqual(expect.any(String));
  });
});
