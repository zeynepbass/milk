import http from "node:http";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { io as connectClient } from "socket.io-client";
import { createSocketServer } from "../src/sockets/index.js";
import { detachSocketServer } from "../src/sockets/emitter.js";
import Message from "../src/models/Message.js";
import { api, app, createSession } from "./helpers.js";

let httpServer;
let socketServer;
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

beforeEach(async () => {
  httpServer = http.createServer(app);
  socketServer = createSocketServer(httpServer);
  await new Promise((resolve) => httpServer.listen(0, resolve));
  baseUrl = `http://localhost:${httpServer.address().port}`;
});

afterEach(async () => {
  clients.splice(0).forEach((client) => client.disconnect());
  detachSocketServer();
  await new Promise((resolve) => socketServer.close(resolve));
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
});

describe("socket mesajlaşma", () => {
  it("gönderen kimliği sunucudan alınır ve mesaj yalnızca iki tarafa iletilir", async () => {
    const alice = await createSession();
    const bob = await createSession();
    const eve = await createSession();

    const [aliceClient, bobClient, eveClient] = [alice, bob, eve].map((session) =>
      connect(session.accessToken)
    );
    await Promise.all([aliceClient, bobClient, eveClient].map(waitForConnection));

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

    const bobClient = connect(bob.accessToken);
    await waitForConnection(bobClient);
    const bobReceives = waitForEvent(bobClient, "message:new");

    await api().post("/api/messages").set(alice.auth).send({ receiverId: bob.user._id, text: "REST mesajı" });

    expect((await bobReceives).text).toBe("REST mesajı");
  });

  it("geçersiz yükü reddeder ve kayıt oluşturmaz", async () => {
    const alice = await createSession();
    const client = connect(alice.accessToken);
    await waitForConnection(client);

    const ack = await client.emitWithAck("message:send", { receiverId: "x", text: "" });

    expect(ack.ok).toBe(false);
    expect(ack.code).toBe("VALIDATION_ERROR");
    expect(await Message.countDocuments()).toBe(0);
  });

  it("dondurulan hesabın açık socket bağlantısı kapatılır", async () => {
    const alice = await createSession();
    const client = connect(alice.accessToken);
    await waitForConnection(client);

    const disconnected = waitForEvent(client, "disconnect", 1000);
    await api().post("/api/users/me/freeze").set(alice.auth);

    expect(await disconnected).toBe("io server disconnect");
  });
});
