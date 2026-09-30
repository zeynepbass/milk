import { describe, expect, it } from "vitest";
import User from "../src/models/User.js";
import Post from "../src/models/Post.js";
import Comment from "../src/models/Comment.js";
import Follow from "../src/models/Follow.js";
import Conversation from "../src/models/Conversation.js";
import Notification from "../src/models/Notification.js";
import { api, createPost, createSession, drainJobs, login, PNG_BYTES } from "./helpers.js";

describe("hesap silme", () => {
  it("şifre doğrulaması ister", async () => {
    const { user, auth } = await createSession();

    const wrong = await api().delete("/api/users/me").set(auth).send({ password: "yanlis" });
    expect(wrong.status).toBe(401);
    expect((await User.findById(user._id).lean()).deletedAt).toBeNull();
  });

  it("ilişkili verileri gizler, sayaçları düzeltir ve dosyaları temizler", async () => {
    const seller = await createSession();
    const buyer = await createSession({ province: undefined });
    const friend = await createSession();

    const avatar = await api()
      .put("/api/users/me/avatar")
      .set(seller.auth)
      .attach("avatar", PNG_BYTES, { filename: "a.png", contentType: "image/png" });
    const { body } = await createPost(seller.auth);
    const imageUrl = body.post.images[0];

    await api().put(`/api/users/${seller.user._id}/follow`).set(buyer.auth);
    await api().put(`/api/users/${friend.user._id}/follow`).set(seller.auth);
    await api().post(`/api/posts/${body.post._id}/comments`).set(seller.auth).send({ text: "Benim yorumum" });
    await api().post("/api/messages").set(buyer.auth).send({ receiverId: seller.user._id, text: "Merhaba" });
    await drainJobs();

    const response = await api()
      .delete("/api/users/me")
      .set(seller.auth)
      .send({ password: seller.user.password });
    expect(response.status).toBe(200);

    const stored = await User.findById(seller.user._id).select("+password").lean();
    expect(stored.deletedAt).toBeInstanceOf(Date);
    expect(stored.email).not.toBe(seller.user.email);
    expect(stored.password).toBeUndefined();

    expect((await Post.findById(body.post._id).lean()).isActive).toBe(false);
    expect(await Comment.countDocuments({ user: seller.user._id, isActive: true })).toBe(0);
    expect(
      await Follow.countDocuments({ $or: [{ follower: seller.user._id }, { following: seller.user._id }] })
    ).toBe(0);
    expect((await User.findById(buyer.user._id).lean()).followingCount).toBe(0);
    expect((await User.findById(friend.user._id).lean()).followersCount).toBe(0);
    expect(await Conversation.countDocuments({ participants: seller.user._id, hiddenAt: null })).toBe(0);
    expect(await Notification.countDocuments({ actor: seller.user._id })).toBe(0);

    expect((await api().get(imageUrl)).status).toBe(404);
    expect((await api().get(avatar.body.user.avatar)).status).toBe(404);

    expect((await api().get("/api/users/me").set(seller.auth)).status).toBe(401);
    expect((await login(seller.user.email)).response.status).toBe(401);

    const buyerConversations = await api().get("/api/conversations").set(buyer.auth);
    expect(buyerConversations.body).toHaveLength(0);
  });

  it("silinen hesabın e-postasıyla yeniden kayıt olunabilir", async () => {
    const session = await createSession({ email: "tekrar@ornek.com" });
    await api().delete("/api/users/me").set(session.auth).send({ password: session.user.password });

    const response = await api()
      .post("/api/auth/register")
      .send({ name: "Yeni", surname: "Hesap", email: "tekrar@ornek.com", password: "baska-sifre-1" });

    expect(response.status).toBe(201);
  });
});
