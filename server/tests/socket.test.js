import http from "node:http";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { io as connectClient } from "socket.io-client";
import { createSocketServer } from "../src/sockets/index.js";
import Message from "../src/models/Message.js";
import { api, app, createPost, createSession, drainJobs } from "./helpers.js";

let httpServer;
let sockets;
let baseUrl;
const clients = [];

const connect = (token) => {
  const client = connectClient(baseUrl, {
    auth: token ? { token } : {},
    transports: ["websocket"],
    reconnection: false,
    forceNew: true,
  });
  clients.push(client);
  return client;
};

const waitForConnection = (client) =>
  new Promise((resolve, reject) => {
    client.once("connect", resolve);
    client.once("connect_error", reject);
  });

const waitForEvent = (client, event, timeout = 500) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeout);
    client.once(event, (payload) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });

const connectAll = async (...sessions) => {
  const connected = sessions.map((session) => connect(session.accessToken));
  await Promise.all(connected.map(waitForConnection));
  return connected;
};

beforeEach(async () => {
  httpServer = http.createServer(app);
  sockets = await createSocketServer(httpServer);
  await new Promise((resolve) => httpServer.listen(0, resolve));
  baseUrl = `http://localhost:${httpServer.address().port}`;
});

afterEach(async () => {
  clients.splice(0).forEach((client) => client.disconnect());
  await sockets.close();
});

describe("socket kimlik doğrulaması", () => {
  it("token olmadan bağlantıyı reddeder", async () => {
    const error = await waitForConnection(connect()).catch((err) => err);

    expect(error).toBeInstanceOf(Error);
    expect(error.data.code).toBe("TOKEN_MISSING");
  });

  it("geçersiz token ile bağlantıyı reddeder", async () => {
    const error = await waitForConnection(connect("gecersiz")).catch((err) => err);
    expect(error.data.code).toBe("TOKEN_INVALID");
  });

  it("dondurulmuş hesabın bağlantısını reddeder", async () => {
    const { accessToken, auth } = await createSession();
    await api().post("/api/users/me/freeze").set(auth);

    const error = await waitForConnection(connect(accessToken)).catch((err) => err);
    expect(error.data.code).toBe("ACCOUNT_FROZEN");
  });

  it("dondurulan hesabın açık bağlantısı kapatılır", async () => {
    const alice = await createSession();
    const [client] = await connectAll(alice);

    const disconnected = waitForEvent(client, "disconnect", 1000);
    await api().post("/api/users/me/freeze").set(alice.auth);

    expect(await disconnected).toBe("io server disconnect");
  });
});

describe("socket mesajlaşma", () => {
  it("gönderen kimliği sunucudan alınır ve mesaj yalnızca iki tarafa iletilir", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const eve = await createSession();
    const [aliceClient, bobClient, eveClient] = await connectAll(alice, bob, eve);

    const bobReceives = waitForEvent(bobClient, "message:new");
    const eveReceives = waitForEvent(eveClient, "message:new");

    const ack = await aliceClient.emitWithAck("message:send", {
      receiverId: bob.user._id,
      text: "Selam",
      senderId: eve.user._id,
    });

    expect(ack.ok).toBe(true);
    expect(ack.message.senderId).toBe(alice.user._id);
    expect((await bobReceives).text).toBe("Selam");
    expect(await eveReceives).toBeNull();
  });

  it("REST ile gönderilen mesaj da alıcıya anlık iletilir", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const [bobClient] = await connectAll(bob);
    const bobReceives = waitForEvent(bobClient, "message:new");

    await api().post("/api/messages").set(alice.auth).send({ receiverId: bob.user._id, text: "REST mesajı" });

    expect((await bobReceives).text).toBe("REST mesajı");
  });

  it("geçersiz yükü reddeder ve kayıt oluşturmaz", async () => {
    const alice = await createSession();
    const [client] = await connectAll(alice);

    const ack = await client.emitWithAck("message:send", { receiverId: "x", text: "" });

    expect(ack.ok).toBe(false);
    expect(ack.code).toBe("VALIDATION_ERROR");
    expect(await Message.countDocuments()).toBe(0);
  });

  it("okundu bilgisi göndericiye iletilir", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const [aliceClient, bobClient] = await connectAll(alice, bob);

    const { message } = await aliceClient.emitWithAck("message:send", {
      receiverId: bob.user._id,
      text: "Okudun mu?",
    });
    const aliceNotified = waitForEvent(aliceClient, "message:read");

    const ack = await bobClient.emitWithAck("conversation:read", { conversationId: message.conversationId });

    expect(ack).toMatchObject({ ok: true, updated: 1 });
    expect(await aliceNotified).toMatchObject({
      conversationId: message.conversationId,
      readerId: bob.user._id,
    });
  });

  it("katılımcı olmayan kullanıcı konuşmayı okundu yapamaz", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const eve = await createSession();
    const [aliceClient, eveClient] = await connectAll(alice, eve);

    const { message } = await aliceClient.emitWithAck("message:send", {
      receiverId: bob.user._id,
      text: "Gizli",
    });
    const ack = await eveClient.emitWithAck("conversation:read", { conversationId: message.conversationId });

    expect(ack).toMatchObject({ ok: false, code: "CONVERSATION_NOT_FOUND" });
  });
});

describe("çevrimiçi durumu", () => {
  it("bağlanan kullanıcıya liste, diğerlerine güncelleme gider", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const [aliceClient] = await connectAll(alice);

    const aliceSeesBob = waitForEvent(aliceClient, "presence:update", 1000);
    const bobClient = connect(bob.accessToken);
    const bobList = waitForEvent(bobClient, "presence:list", 1000);

    expect(await aliceSeesBob).toEqual({ userId: bob.user._id, online: true });
    expect(await bobList).toEqual(expect.arrayContaining([alice.user._id, bob.user._id]));

    const aliceSeesOffline = waitForEvent(aliceClient, "presence:update", 1000);
    bobClient.disconnect();
    expect(await aliceSeesOffline).toEqual({ userId: bob.user._id, online: false });
  });
});

describe("anlık bildirimler", () => {
  it("bildirim ve okunmamış sayısı socket ile iletilir", async () => {
    const seller = await createSession();
    const fan = await createSession();
    const [sellerClient] = await connectAll(seller);
    const { body } = await createPost(seller.auth);

    const received = waitForEvent(sellerClient, "notification:new", 1000);
    await api().put(`/api/posts/${body.post._id}/like`).set(fan.auth);
    await drainJobs();

    const payload = await received;
    expect(payload.notification.type).toBe("post_like");
    expect(payload.unreadCount).toBe(1);
  });
});
