import { describe, expect, it } from "vitest";
import Notification from "../src/models/Notification.js";
import Post from "../src/models/Post.js";
import Comment from "../src/models/Comment.js";
import { api, createSession, PNG_BYTES } from "./helpers.js";

const createPost = async (auth, overrides = {}) => {
  const response = await api()
    .post("/api/posts")
    .set(auth)
    .field("title", overrides.title ?? "Taze süt")
    .field("category", overrides.category ?? "sut_urunleri")
    .field("province", overrides.province ?? "İzmir")
    .attach("images", PNG_BYTES, { filename: "urun.png", contentType: "image/png" });

  return response;
};

describe("gönderiler", () => {
  it("satıcı gönderi oluşturur, istemciden gelen sahip alanları yok sayılır", async () => {
    const seller = await createSession();
    const other = await createSession();

    const response = await api()
      .post("/api/posts")
      .set(seller.auth)
      .field("title", "Bal")
      .field("category", "bal")
      .field("user", other.user._id)
      .field("ownerName", "Sahte");

    expect(response.status).toBe(201);
    expect(response.body.post.user).toBe(seller.user._id);
    expect(response.body.post.ownerName).toBe(seller.user.name);
  });

  it("alıcı gönderi oluşturamaz", async () => {
    const buyer = await createSession({ role: "alici" });
    const response = await createPost(buyer.auth);

    expect(response.status).toBe(403);
  });

  it("başkasının gönderisini güncelleyemez veya silemez", async () => {
    const owner = await createSession();
    const intruder = await createSession();
    const { body } = await createPost(owner.auth);
    const postId = body.post._id;

    const update = await api().put(`/api/posts/${postId}`).set(intruder.auth).field("title", "Ele geçirildi");
    const remove = await api().delete(`/api/posts/${postId}`).set(intruder.auth);

    expect(update.status).toBe(403);
    expect(remove.status).toBe(403);

    const post = await Post.findById(postId).lean();
    expect(post.title).toBe("Taze süt");
    expect(post.isActive).toBe(true);
  });

  it("eşzamanlı beğenilerde aynı kullanıcı birden fazla kez eklenmez", async () => {
    const owner = await createSession();
    const fan = await createSession();
    const { body } = await createPost(owner.auth);

    await Promise.all(
      Array.from({ length: 6 }, () => api().post(`/api/posts/${body.post._id}/like/post`).set(fan.auth))
    );

    const post = await Post.findById(body.post._id).lean();
    const unique = new Set(post.likes.map(String));
    expect(unique.size).toBe(post.likes.length);
  });

  it("yeni gönderi bildirimi paylaşan kişinin bilgisiyle oluşturulur", async () => {
    const neighbour = await createSession();
    await api().patch("/api/users/me").set(neighbour.auth).send({ province: "İzmir" });
    const seller = await createSession({ name: "Mehmet", surname: "Demir" });

    await createPost(seller.auth, { province: "İzmir" });

    const response = await api().get("/api/posts/notifications").set(neighbour.auth);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].message).toContain("Mehmet Demir");
    expect(response.body[0].userId).toBe(seller.user._id);
  });
});

describe("yorumlar", () => {
  it("başkasının yorumunu silemez", async () => {
    const owner = await createSession();
    const commenter = await createSession();
    const intruder = await createSession();
    const { body } = await createPost(owner.auth);

    const comment = await api()
      .post(`/api/comments/${body.post._id}`)
      .set(commenter.auth)
      .send({ text: "Harika ürün" });

    const response = await api().delete(`/api/comments/${comment.body._id}`).set(intruder.auth);

    expect(response.status).toBe(403);
    expect((await Comment.findById(comment.body._id).lean()).isActive).toBe(true);
  });
});

describe("bildirimler", () => {
  it("başkasının bildirimini okundu yapamaz", async () => {
    const owner = await createSession();
    const intruder = await createSession();

    const notification = await Notification.create({
      userId: owner.user._id,
      type: "new_post",
      province: "İzmir",
      date: "2026-09-30",
    });

    const response = await api().put(`/api/posts/markAsRead/${notification._id}`).set(intruder.auth);

    expect(response.status).toBe(404);
    expect((await Notification.findById(notification._id).lean()).isRead).toBe(false);

    const own = await api().put(`/api/posts/markAsRead/${notification._id}`).set(owner.auth);
    expect(own.status).toBe(200);
  });
});

describe("konuşmalar", () => {
  it("konuşmalar yalnızca oturumdaki kullanıcı için listelenir", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const eve = await createSession();

    await api().post("/api/messages").set(alice.auth).send({ receiverId: bob.user._id, text: "Merhaba" });

    const eveList = await api().get("/api/conversations").set(eve.auth);
    expect(eveList.body).toHaveLength(0);

    const bobView = await api().get(`/api/conversations/with/${alice.user._id}`).set(bob.auth);
    expect(bobView.body.messages).toHaveLength(1);
    expect(bobView.body.messages[0].senderId).toBe(alice.user._id);
  });

  it("gönderen kimliği istemciden alınmaz", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const eve = await createSession();

    const response = await api()
      .post("/api/messages")
      .set(eve.auth)
      .send({ receiverId: bob.user._id, text: "Ben Alice'im", senderId: alice.user._id });

    expect(response.status).toBe(201);
    expect(response.body.senderId).toBe(eve.user._id);
  });
});
