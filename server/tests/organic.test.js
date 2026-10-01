import { describe, expect, it } from "vitest";
import User from "../src/models/User.js";
import OrganicApplication from "../src/models/OrganicApplication.js";
import Notification from "../src/models/Notification.js";
import { api, createAdminSession, createSession, PNG_BYTES } from "./helpers.js";

const PDF_BYTES = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n"
);

const apply = (auth, buffer = PDF_BYTES, contentType = "application/pdf") =>
  api()
    .post("/api/organic-applications")
    .set(auth)
    .attach("document", buffer, { filename: "sertifika.pdf", contentType });

describe("organik sertifika başvurusu", () => {
  it("satıcı PDF ile başvurur ve durumunu görür", async () => {
    const seller = await createSession();

    const response = await apply(seller.auth);
    expect(response.status).toBe(201);
    expect(response.body.application).toMatchObject({ status: "pending", originalName: "sertifika.pdf" });
    expect(response.body.application.documentKey).toBeUndefined();

    const mine = await api().get("/api/organic-applications/mine").set(seller.auth);
    expect(mine.body.application.status).toBe("pending");
  });

  it("PDF olmayan dosyayı reddeder", async () => {
    const seller = await createSession();

    const disguised = await apply(seller.auth, PNG_BYTES, "application/pdf");
    const image = await apply(seller.auth, PNG_BYTES, "image/png");

    expect(disguised.status).toBe(400);
    expect(image.status).toBe(400);
    expect(await OrganicApplication.countDocuments()).toBe(0);
  });

  it("alıcı başvuru yapamaz", async () => {
    const buyer = await createSession({ role: "alici" });
    expect((await apply(buyer.auth)).status).toBe(403);
  });

  it("bekleyen başvuru varken ikinci başvuru 409 döner", async () => {
    const seller = await createSession();
    await apply(seller.auth);

    const second = await apply(seller.auth);
    expect(second.status).toBe(409);
    expect(second.body.code).toBe("APPLICATION_PENDING");
  });

  it("eşzamanlı başvurularda yalnızca bir bekleyen kayıt oluşur", async () => {
    const seller = await createSession();

    const responses = await Promise.all([apply(seller.auth), apply(seller.auth), apply(seller.auth)]);

    expect(responses.filter((response) => response.status === 201)).toHaveLength(1);
    expect(await OrganicApplication.countDocuments({ status: "pending" })).toBe(1);
  });
});

describe("başvuru incelemesi", () => {
  it("admin onaylar, satıcı rozet ve bildirim alır", async () => {
    const seller = await createSession();
    const admin = await createAdminSession();
    const { body } = await apply(seller.auth);

    const pending = await api().get("/api/organic-applications?status=pending").set(admin.auth);
    expect(pending.body.items).toHaveLength(1);
    expect(pending.body.items[0].user.email).toBe(seller.user.email);

    const review = await api()
      .patch(`/api/organic-applications/${body.application._id}`)
      .set(admin.auth)
      .send({ decision: "approved" });

    expect(review.status).toBe(200);
    const stored = await User.findById(seller.user._id).lean();
    expect(stored).toMatchObject({ organicStatus: true, dogrulanmisSatici: true });

    const notifications = await api().get("/api/notifications").set(seller.auth);
    expect(notifications.body.items[0]).toMatchObject({ type: "organic_approved" });

    const again = await apply(seller.auth);
    expect(again.body.code).toBe("ALREADY_VERIFIED");
  });

  it("reddetme gerekçe ister ve rozet vermez", async () => {
    const seller = await createSession();
    const admin = await createAdminSession();
    const { body } = await apply(seller.auth);
    const url = `/api/organic-applications/${body.application._id}`;

    const withoutNote = await api().patch(url).set(admin.auth).send({ decision: "rejected" });
    expect(withoutNote.status).toBe(400);

    const rejected = await api()
      .patch(url)
      .set(admin.auth)
      .send({ decision: "rejected", note: "Belge okunaklı değil" });
    expect(rejected.body.application).toMatchObject({ status: "rejected", note: "Belge okunaklı değil" });
    expect((await User.findById(seller.user._id).lean()).dogrulanmisSatici).toBe(false);
    expect(await Notification.countDocuments({ type: "organic_rejected" })).toBe(1);

    const twice = await api().patch(url).set(admin.auth).send({ decision: "approved" });
    expect(twice.status).toBe(409);

    expect((await apply(seller.auth)).status).toBe(201);
  });

  it("admin olmayan kullanıcı başvuruları göremez ve inceleyemez", async () => {
    const seller = await createSession();
    const other = await createSession();
    const { body } = await apply(seller.auth);

    expect((await api().get("/api/organic-applications").set(other.auth)).status).toBe(403);
    expect(
      (
        await api()
          .patch(`/api/organic-applications/${body.application._id}`)
          .set(seller.auth)
          .send({ decision: "approved" })
      ).status
    ).toBe(403);
  });
});

describe("başvuru belgesi", () => {
  it("yalnızca sahibi ve admin indirebilir, herkese açık değildir", async () => {
    const seller = await createSession();
    const admin = await createAdminSession();
    const stranger = await createSession();
    const { body } = await apply(seller.auth);
    const url = `/api/organic-applications/${body.application._id}/document`;

    const owner = await api().get(url).set(seller.auth).buffer(true);
    expect(owner.status).toBe(200);
    expect(owner.headers["content-type"]).toBe("application/pdf");
    expect(owner.body.toString().startsWith("%PDF")).toBe(true);

    expect((await api().get(url).set(admin.auth)).status).toBe(200);
    expect((await api().get(url).set(stranger.auth)).status).toBe(404);
    expect((await api().get(url)).status).toBe(401);

    const stored = await OrganicApplication.findById(body.application._id).lean();
    expect((await api().get(`/uploads/${stored.documentKey}`)).status).toBe(404);
  });

  it("hesap silinince başvuru ve belge silinir", async () => {
    const seller = await createSession();
    const { body } = await apply(seller.auth);
    await api().delete("/api/users/me").set(seller.auth).send({ password: seller.user.password });

    expect(await OrganicApplication.exists({ _id: body.application._id })).toBeNull();
  });
});
