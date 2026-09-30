import { describe, expect, it } from "vitest";
import Conversation from "../src/models/Conversation.js";
import { api, createSession } from "./helpers.js";

const send = (from, to, text) =>
  api().post("/api/messages").set(from.auth).send({ receiverId: to.user._id, text });

describe("mesajlaşma", () => {
  it("konuşmalar yalnızca katılımcılara görünür", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const eve = await createSession();

    const message = await send(alice, bob, "Merhaba");

    expect((await api().get("/api/conversations").set(eve.auth)).body).toHaveLength(0);

    const forbidden = await api()
      .get(`/api/conversations/${message.body.conversationId}/messages`)
      .set(eve.auth);
    expect(forbidden.status).toBe(404);

    const bobView = await api()
      .get(`/api/conversations/${message.body.conversationId}/messages`)
      .set(bob.auth);
    expect(bobView.body.items).toHaveLength(1);
    expect(bobView.body.items[0].senderId).toBe(alice.user._id);
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

  it("eşzamanlı ilk mesajlarda tek konuşma oluşur", async () => {
    const alice = await createSession();
    const bob = await createSession();

    await Promise.all([send(alice, bob, "1"), send(bob, alice, "2"), send(alice, bob, "3")]);

    expect(await Conversation.countDocuments()).toBe(1);
  });

  it("mesajlar yeniden eskiye cursor ile sayfalanır", async () => {
    const alice = await createSession();
    const bob = await createSession();

    let conversationId;
    for (let index = 1; index <= 5; index += 1) {
      conversationId = (await send(alice, bob, `Mesaj ${index}`)).body.conversationId;
    }

    const first = await api().get(`/api/conversations/${conversationId}/messages?limit=3`).set(bob.auth);
    const second = await api()
      .get(`/api/conversations/${conversationId}/messages?limit=3&cursor=${first.body.nextCursor}`)
      .set(bob.auth);

    expect(first.body.items.map((message) => message.text)).toEqual(["Mesaj 5", "Mesaj 4", "Mesaj 3"]);
    expect(second.body.items.map((message) => message.text)).toEqual(["Mesaj 2", "Mesaj 1"]);
    expect(second.body.nextCursor).toBeNull();
  });

  it("konuşma başına okunmamış sayısı ve okundu bilgisi tutulur", async () => {
    const alice = await createSession();
    const bob = await createSession();

    await send(alice, bob, "Bir");
    const last = await send(alice, bob, "İki");

    const [conversation] = (await api().get("/api/conversations").set(bob.auth)).body;
    expect(conversation.unreadCount).toBe(2);

    const [aliceConversation] = (await api().get("/api/conversations").set(alice.auth)).body;
    expect(aliceConversation.unreadCount).toBe(0);

    const read = await api().patch(`/api/conversations/${last.body.conversationId}/read`).set(bob.auth);
    expect(read.body.updated).toBe(2);

    const [afterRead] = (await api().get("/api/conversations").set(bob.auth)).body;
    expect(afterRead.unreadCount).toBe(0);

    const messages = await api()
      .get(`/api/conversations/${last.body.conversationId}/messages`)
      .set(alice.auth);
    expect(messages.body.items.every((message) => message.readAt)).toBe(true);
  });

  it("henüz konuşma yokken karşı taraf bilgisi döner", async () => {
    const alice = await createSession({ name: "Alice" });
    const bob = await createSession();

    const response = await api().get(`/api/conversations/with/${alice.user._id}`).set(bob.auth);

    expect(response.body._id).toBeNull();
    expect(response.body.participants[0].name).toBe("Alice");
  });

  it("kendine ve dondurulmuş hesaba mesaj gönderilemez", async () => {
    const alice = await createSession();
    const bob = await createSession();
    await api().post("/api/users/me/freeze").set(bob.auth);

    expect((await send(alice, alice, "x")).status).toBe(400);
    expect((await send(alice, bob, "x")).status).toBe(404);
  });
});
