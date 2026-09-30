import { describe, expect, it } from "vitest";
import Notification from "../src/models/Notification.js";
import { GROUPING_WINDOWS } from "../src/services/notification.service.js";
import { api, createPost, createSession, drainJobs } from "./helpers.js";

const listFor = async (session) => (await api().get("/api/notifications").set(session.auth)).body;

const unreadFor = async (session) =>
  (await api().get("/api/notifications/unread-count").set(session.auth)).body.unreadCount;

describe("yeni gönderi bildirimleri", () => {
  it("istek sırasında değil iş kuyruğunda dağıtılır", async () => {
    const follower = await createSession();
    const seller = await createSession({ name: "Mehmet", surname: "Demir" });
    await api().put(`/api/users/${seller.user._id}/follow`).set(follower.auth);
    await drainJobs();
    await Notification.deleteMany({});

    await createPost(seller.auth);
    expect(await Notification.countDocuments({ type: "new_post" })).toBe(0);

    await drainJobs();
    const { items } = await listFor(follower);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "new_post", count: 1, isRead: false });
    expect(items[0].message).toBe("Mehmet Demir yeni bir gönderi paylaştı");
    expect(items[0].actor._id).toBe(seller.user._id);
  });

  it("takipçilere ve aynı ildeki kullanıcılara gider, satıcının kendisine gitmez", async () => {
    const neighbour = await createSession();
    await api().patch("/api/users/me").set(neighbour.auth).send({ province: "İzmir" });
    const stranger = await createSession();
    await api().patch("/api/users/me").set(stranger.auth).send({ province: "Ankara" });
    const seller = await createSession();
    await api().patch("/api/users/me").set(seller.auth).send({ province: "İzmir" });

    await createPost(seller.auth, { province: "İzmir" });
    await drainJobs();

    expect((await listFor(neighbour)).items).toHaveLength(1);
    expect((await listFor(stranger)).items).toHaveLength(0);
    expect((await listFor(seller)).items).toHaveLength(0);
  });

  it("aynı satıcının kısa sürede paylaştığı gönderileri birleştirir", async () => {
    const follower = await createSession();
    const seller = await createSession({ name: "Ali", surname: "Can" });
    await api().put(`/api/users/${seller.user._id}/follow`).set(follower.auth);

    await createPost(seller.auth, { title: "Bir" });
    await createPost(seller.auth, { title: "İki" });
    await createPost(seller.auth, { title: "Üç" });
    await drainJobs();

    const newPosts = (await listFor(follower)).items.filter((item) => item.type === "new_post");
    expect(newPosts).toHaveLength(1);
    expect(newPosts[0]).toMatchObject({ count: 3, message: "Ali Can 3 yeni gönderi paylaştı" });
  });

  it("farklı satıcıların ve pencere dışındaki gönderilerin bildirimi engellenmez", async () => {
    const follower = await createSession();
    const firstSeller = await createSession();
    const secondSeller = await createSession();
    await api().put(`/api/users/${firstSeller.user._id}/follow`).set(follower.auth);
    await api().put(`/api/users/${secondSeller.user._id}/follow`).set(follower.auth);

    await createPost(firstSeller.auth);
    await createPost(secondSeller.auth);
    await drainJobs();

    await Notification.updateMany(
      { groupKey: `new_post:${firstSeller.user._id}` },
      { $set: { lastActivityAt: new Date(Date.now() - GROUPING_WINDOWS.new_post - 1000) } }
    );
    await createPost(firstSeller.auth);
    await drainJobs();

    const newPosts = (await listFor(follower)).items.filter((item) => item.type === "new_post");
    expect(newPosts).toHaveLength(3);
  });

  it("okunan grup yerine yeni bildirim açılır", async () => {
    const follower = await createSession();
    const seller = await createSession();
    await api().put(`/api/users/${seller.user._id}/follow`).set(follower.auth);

    await createPost(seller.auth);
    await drainJobs();
    await api().patch("/api/notifications/read-all").set(follower.auth);

    await createPost(seller.auth);
    await drainJobs();

    const newPosts = (await listFor(follower)).items.filter((item) => item.type === "new_post");
    expect(newPosts.map((item) => item.isRead)).toEqual([false, true]);
  });
});

describe("etkileşim bildirimleri", () => {
  it("beğeni, yorum ve takip bildirim üretir, kendi etkileşimi üretmez", async () => {
    const seller = await createSession();
    const fan = await createSession({ name: "Zeynep", surname: "Kara" });
    const { body } = await createPost(seller.auth);

    await api().put(`/api/posts/${body.post._id}/like`).set(fan.auth);
    await api().post(`/api/posts/${body.post._id}/comments`).set(fan.auth).send({ text: "Güzel" });
    await api().put(`/api/users/${seller.user._id}/follow`).set(fan.auth);
    await api().put(`/api/posts/${body.post._id}/like`).set(seller.auth);
    await drainJobs();

    const { items } = await listFor(seller);
    expect(items.map((item) => item.type).sort()).toEqual(["follow", "post_comment", "post_like"]);
    expect(items.find((item) => item.type === "follow").message).toBe("Zeynep Kara seni takip etmeye başladı");
    expect(await unreadFor(seller)).toBe(3);
  });

  it("aynı gönderiye gelen beğeniler gruplanır", async () => {
    const seller = await createSession();
    const fans = await Promise.all(Array.from({ length: 3 }, () => createSession()));
    const { body } = await createPost(seller.auth);

    for (const fan of fans) {
      await api().put(`/api/posts/${body.post._id}/like`).set(fan.auth);
    }
    await drainJobs();

    const likes = (await listFor(seller)).items.filter((item) => item.type === "post_like");
    expect(likes).toHaveLength(1);
    expect(likes[0].count).toBe(3);
    expect(likes[0].message).toMatch(/ve 2 kişi daha gönderini beğendi$/);
  });

  it("beğeni geri alınıp tekrar yapılınca bildirim çoğalmaz", async () => {
    const seller = await createSession();
    const fan = await createSession();
    const { body } = await createPost(seller.auth);

    await api().put(`/api/posts/${body.post._id}/like`).set(fan.auth);
    await api().put(`/api/posts/${body.post._id}/like`).set(fan.auth);
    await drainJobs();

    expect((await listFor(seller)).items).toHaveLength(1);
  });
});

describe("okundu işlemleri", () => {
  it("başkasının bildirimini okundu yapamaz", async () => {
    const seller = await createSession();
    const fan = await createSession();
    const intruder = await createSession();
    await api().put(`/api/users/${seller.user._id}/follow`).set(fan.auth);
    await drainJobs();

    const [notification] = (await listFor(seller)).items;

    const foreign = await api().patch(`/api/notifications/${notification._id}/read`).set(intruder.auth);
    expect(foreign.status).toBe(404);
    expect(await unreadFor(seller)).toBe(1);

    const own = await api().patch(`/api/notifications/${notification._id}/read`).set(seller.auth);
    expect(own.status).toBe(200);
    expect(await unreadFor(seller)).toBe(0);
  });

  it("tümünü okundu yapar", async () => {
    const seller = await createSession();
    const fans = await Promise.all(Array.from({ length: 2 }, () => createSession()));
    for (const fan of fans) await api().put(`/api/users/${seller.user._id}/follow`).set(fan.auth);
    await drainJobs();

    const response = await api().patch("/api/notifications/read-all").set(seller.auth);
    expect(response.body.updated).toBe(2);
    expect(await unreadFor(seller)).toBe(0);
  });

  it("bildirim listesi sayfalanır", async () => {
    const seller = await createSession();
    const fans = await Promise.all(Array.from({ length: 3 }, () => createSession()));
    for (const fan of fans) await api().put(`/api/users/${seller.user._id}/follow`).set(fan.auth);
    await drainJobs();

    const first = await api().get("/api/notifications?limit=2").set(seller.auth);
    const second = await api().get(`/api/notifications?limit=2&cursor=${first.body.nextCursor}`).set(seller.auth);

    expect(first.body.items).toHaveLength(2);
    expect(second.body.items).toHaveLength(1);
    expect(second.body.nextCursor).toBeNull();
  });
});
