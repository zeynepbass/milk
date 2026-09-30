import { describe, expect, it, vi } from "vitest";
import RefreshToken from "../src/models/RefreshToken.js";
import User from "../src/models/User.js";
import { REFRESH_RACE_GRACE_MS } from "../src/services/token.service.js";
import { ORIGIN, PASSWORD, api, createSession, extractRefreshCookie, login, registerUser } from "./helpers.js";

const refresh = (cookie) => api().post("/api/auth/refresh").set("Origin", ORIGIN).set("Cookie", cookie ?? "");

describe("kayıt", () => {
  it("e-postayı normalize eder ve şifre hash'ini döndürmez", async () => {
    const response = await api()
      .post("/api/auth/register")
      .send({ name: "Ali", surname: "Kaya", email: "  Ali.Kaya@Ornek.COM ", password: PASSWORD });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("ali.kaya@ornek.com");
    expect(JSON.stringify(response.body)).not.toContain("password");
  });

  it("aynı e-posta ile ikinci kaydı 409 ile reddeder", async () => {
    await registerUser({ email: "tekrar@ornek.com" });
    const response = await api()
      .post("/api/auth/register")
      .send({ name: "Ali", surname: "Kaya", email: "TEKRAR@ornek.com", password: PASSWORD });

    expect(response.status).toBe(409);
  });

  it("kayıtta admin rolü seçilemez", async () => {
    const response = await api()
      .post("/api/auth/register")
      .send({ name: "Ali", surname: "Kaya", email: "admin@ornek.com", password: PASSWORD, role: "admin" });

    expect(response.status).toBe(400);
    expect(await User.exists({ email: "admin@ornek.com" })).toBeNull();
  });
});

describe("giriş", () => {
  it("başarılı girişte 200, access token ve httpOnly refresh cookie döner", async () => {
    const user = await registerUser();
    const { response, cookie } = await login(user.email);

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(cookie).toMatch(/^milk_rt=/);
    expect(response.headers["set-cookie"][0]).toMatch(/HttpOnly/);
    expect(response.headers["set-cookie"][0]).toMatch(/SameSite=Lax/);
  });

  it("olmayan kullanıcı ve yanlış şifre için aynı yanıtı verir", async () => {
    const user = await registerUser();
    const wrongPassword = await api().post("/api/auth/login").send({ email: user.email, password: "yanlis-sifre" });
    const unknownUser = await api().post("/api/auth/login").send({ email: "yok@ornek.com", password: "yanlis-sifre" });

    expect(wrongPassword.status).toBe(401);
    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.body.message).toBe(unknownUser.body.message);
    expect(wrongPassword.body.code).toBe(unknownUser.body.code);
  });
});

describe("refresh token", () => {
  it("her yenilemede token'ı döndürür ve yeni access token verir", async () => {
    const { cookie } = await createSession();
    const response = await refresh(cookie);

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(extractRefreshCookie(response)).not.toBe(cookie);
  });

  it("süresi geçmiş bir yenilemenin tekrar kullanımında tüm aileyi iptal eder", async () => {
    const { cookie } = await createSession();
    const first = await refresh(cookie);
    const rotatedCookie = extractRefreshCookie(first);

    vi.useFakeTimers({ now: Date.now() + REFRESH_RACE_GRACE_MS + 1000, toFake: ["Date"] });
    const reuse = await refresh(cookie);
    vi.useRealTimers();

    expect(reuse.status).toBe(401);
    expect(reuse.body.code).toBe("REFRESH_INVALID");

    const afterReuse = await refresh(rotatedCookie);
    expect(afterReuse.status).toBe(401);
    expect(await RefreshToken.countDocuments({ revokedAt: null })).toBe(0);
  });

  it("eşzamanlı sekme yarışında aileyi iptal etmez", async () => {
    const { cookie } = await createSession();
    const first = await refresh(cookie);
    const race = await refresh(cookie);

    expect(race.status).toBe(401);
    expect(race.body.code).toBe("REFRESH_RACE");

    const next = await refresh(extractRefreshCookie(first));
    expect(next.status).toBe(200);
  });

  it("izin verilmeyen origin'den gelen yenilemeyi reddeder", async () => {
    const { cookie } = await createSession();
    const response = await api().post("/api/auth/refresh").set("Origin", "https://kotu.site").set("Cookie", cookie);

    expect(response.status).toBe(403);
  });

  it("çıkış yapıldıktan sonra refresh token kullanılamaz", async () => {
    const { cookie } = await createSession();
    const logout = await api().post("/api/auth/logout").set("Origin", ORIGIN).set("Cookie", cookie);
    expect(logout.status).toBe(204);

    const response = await refresh(cookie);
    expect(response.status).toBe(401);
  });
});

describe("dondurulmuş hesap", () => {
  it("dondurulan hesabın access ve refresh token'ı reddedilir", async () => {
    const { auth, cookie } = await createSession();

    const freeze = await api().post("/api/users/me/freeze").set(auth);
    expect(freeze.status).toBe(200);

    const me = await api().get("/api/users/me").set(auth);
    expect(me.status).toBe(401);
    expect(me.body.code).toBe("ACCOUNT_FROZEN");

    expect((await refresh(cookie)).status).toBe(401);
  });

  it("doğru şifreyle giriş hesabı yeniden aktifleştirir", async () => {
    const { user, auth } = await createSession();
    await api().post("/api/users/me/freeze").set(auth);

    const { response } = await login(user.email);
    expect(response.status).toBe(200);
    expect((await User.findById(user._id).lean()).status).toBe(true);
  });
});

describe("şifre değişikliği", () => {
  it("mevcut şifre yanlışsa reddedilir", async () => {
    const { auth } = await createSession();
    const response = await api()
      .put("/api/users/me/password")
      .set(auth)
      .send({ currentPassword: "yanlis-sifre", newPassword: "yeni-sifre-123" });

    expect(response.status).toBe(401);
  });

  it("şifre değişince eski token ve diğer oturumlar geçersizleşir", async () => {
    const { user, auth, cookie } = await createSession();
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const response = await api()
      .put("/api/users/me/password")
      .set(auth)
      .send({ currentPassword: user.password, newPassword: "yeni-sifre-123" });

    expect(response.status).toBe(200);

    const oldToken = await api().get("/api/users/me").set(auth);
    expect(oldToken.status).toBe(401);
    expect(oldToken.body.code).toBe("TOKEN_STALE");
    expect((await refresh(cookie)).status).toBe(401);

    const newToken = await api().get("/api/users/me").set("Authorization", `Bearer ${response.body.accessToken}`);
    expect(newToken.status).toBe(200);
  });
});
