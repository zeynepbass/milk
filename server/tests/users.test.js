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

  it("/me yanıtında şifre hash'i yoktur", async () => {
    const { auth } = await createSession();
    const response = await api().get("/api/users/me").set(auth);

    expect(response.status).toBe(200);
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
    const other = await createSession({ email: "dolu@ornek.com" });
    const { user, auth } = await createSession();

    const response = await api()
      .put("/api/users/me/email")
      .set(auth)
      .send({ email: "DOLU@ornek.com", currentPassword: user.password });

    expect(response.status).toBe(409);
    expect(other.user.email).toBe("dolu@ornek.com");
  });
});

describe("avatar yükleme", () => {
  it("PNG avatarı kabul eder", async () => {
    const { auth } = await createSession();
    const response = await api()
      .put("/api/users/me/avatar")
      .set(auth)
      .attach("avatar", PNG_BYTES, { filename: "avatar.png", contentType: "image/png" });

    expect(response.status).toBe(200);
    expect(response.body.user.avatar).toMatch(/^\/uploads\/[\w-]+\.png$/);
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

describe("hesap silme", () => {
  it("şifre doğrulaması ister", async () => {
    const { user, auth } = await createSession();

    const wrong = await api().delete("/api/users/me").set(auth).send({ password: "yanlis" });
    expect(wrong.status).toBe(401);
    expect(await User.exists({ _id: user._id })).not.toBeNull();

    const right = await api().delete("/api/users/me").set(auth).send({ password: user.password });
    expect(right.status).toBe(200);
    expect(await User.exists({ _id: user._id })).toBeNull();
  });
});

describe("admin işlemleri", () => {
  it("normal kullanıcı rol değiştiremez", async () => {
    const target = await createSession();
    const { auth } = await createSession();

    const response = await api()
      .patch(`/api/users/${target.user._id}/role`)
      .set(auth)
      .send({ role: "admin" });
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
  });

  it("organik statü yanıtında şifre hash'i yoktur", async () => {
    const target = await createSession();
    const admin = await createAdminSession();

    const response = await api()
      .put("/api/users/organicStatus")
      .set(admin.auth)
      .send({ userId: target.user._id, organicStatus: true });

    expect(response.status).toBe(200);
    expect(response.body.user.dogrulanmisSatici).toBe(true);
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);
  });
});

describe("takip", () => {
  it("takip et ve takipten çık iki tarafı da günceller", async () => {
    const target = await createSession();
    const { user, auth } = await createSession();

    const follow = await api().post(`/api/users/follow/${target.user._id}`).set(auth);
    expect(follow.body.following).toBe(true);
    expect((await User.findById(target.user._id).lean()).followers.map(String)).toEqual([user._id]);

    const unfollow = await api().post(`/api/users/follow/${target.user._id}`).set(auth);
    expect(unfollow.body.following).toBe(false);
    expect((await User.findById(user._id).lean()).following).toHaveLength(0);
    expect((await User.findById(target.user._id).lean()).followers).toHaveLength(0);
  });

  it("kendini takip edemez", async () => {
    const { user, auth } = await createSession();
    const response = await api().post(`/api/users/follow/${user._id}`).set(auth);

    expect(response.status).toBe(400);
  });
});
