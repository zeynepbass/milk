import { describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { up as normalizeEmails } from "../migrations/20260930120000-normalize-user-emails.js";
import { up as addParticipantsKey } from "../migrations/20260930120100-conversation-participants-key.js";
import { up as moveFollows } from "../migrations/20260930130000-follow-collection.js";
import { up as migratePosts } from "../migrations/20260930130100-post-counters-and-owner-fields.js";
import { up as migrateNotifications } from "../migrations/20260930130200-notification-model.js";

const db = () => mongoose.connection.db;
const id = () => new mongoose.Types.ObjectId();

describe("migration'lar", () => {
  it("e-postaları normalize eder, çakışmada durur", async () => {
    await db().collection("users").insertMany([{ email: " Ali@Ornek.COM " }]);
    await normalizeEmails(db());
    expect((await db().collection("users").findOne({})).email).toBe("ali@ornek.com");

    await db().collection("users").insertOne({ email: "ALI@ornek.com" });
    await expect(normalizeEmails(db())).rejects.toThrow(/çakışan/);
  });

  it("mükerrer konuşmaları birleştirir", async () => {
    const [a, b] = [id(), id()];
    const first = await db().collection("conversations").insertOne({ participants: [a, b] });
    const second = await db().collection("conversations").insertOne({ participants: [b, a] });
    await db()
      .collection("messages")
      .insertMany([
        { conversationId: first.insertedId, text: "eski", createdAt: new Date(1) },
        { conversationId: second.insertedId, text: "yeni", createdAt: new Date(2) },
      ]);

    await addParticipantsKey(db());

    const conversations = await db().collection("conversations").find().toArray();
    expect(conversations).toHaveLength(1);
    expect(conversations[0].lastMessage).toBe("yeni");
    expect(await db().collection("messages").distinct("conversationId")).toHaveLength(1);
  });

  it("takip dizilerini koleksiyona taşır ve sayaçları hesaplar", async () => {
    const [a, b, c] = [id(), id(), id()];
    await db()
      .collection("users")
      .insertMany([
        { _id: a, email: "a@ornek.com", following: [b, c, a], followers: [] },
        { _id: b, email: "b@ornek.com", following: [c], followers: [a] },
        { _id: c, email: "c@ornek.com", following: [], followers: [a, b] },
      ]);

    await moveFollows(db());

    expect(await db().collection("follows").countDocuments()).toBe(3);
    const users = Object.fromEntries(
      (await db().collection("users").find().toArray()).map((user) => [user._id.toString(), user])
    );
    expect(users[a.toString()]).toMatchObject({ followingCount: 2, followersCount: 0 });
    expect(users[c.toString()]).toMatchObject({ followingCount: 0, followersCount: 2 });
    expect(users[a.toString()].following).toBeUndefined();
  });

  it("gönderi sayaçlarını hesaplar ve kopyalanmış sahip alanlarını kaldırır", async () => {
    await db()
      .collection("posts")
      .insertOne({ likes: [id(), id()], savedBy: [id()], ownerName: "Eski", ownerRole: "satici", image: "x" });

    await migratePosts(db());

    const post = await db().collection("posts").findOne({});
    expect(post).toMatchObject({ likesCount: 2, savesCount: 1, images: [] });
    expect(post.ownerName).toBeUndefined();
    expect(post.image).toBeUndefined();
  });

  it("hatalı eski bildirimleri gönderi sahibiyle düzeltir", async () => {
    const [recipient, author] = [id(), id()];
    const post = await db().collection("posts").insertOne({ user: author });
    await db()
      .collection("notifications")
      .insertMany([
        { userId: recipient, senderId: recipient, postId: post.insertedId, type: "new_post", name: "Yanlış" },
        { userId: recipient, type: "new_post" },
      ]);

    await migrateNotifications(db());

    const notifications = await db().collection("notifications").find().toArray();
    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toMatchObject({ recipient, actor: author, groupKey: `new_post:${author}` });
    expect(notifications[0].name).toBeUndefined();
  });
});
