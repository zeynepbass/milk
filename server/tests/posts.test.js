import { describe, expect, it } from "vitest";
import Post from "../src/models/Post.js";
import Comment from "../src/models/Comment.js";
import { api, createPost, createSession, PNG_BYTES } from "./helpers.js";

describe("gönderi oluşturma", () => {
  it("sahip bilgisi istemciden alınmaz ve kopyalanmaz", async () => {
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
    expect(response.body.post.user._id).toBe(seller.user._id);

    const stored = await Post.findById(response.body.post._id).lean();
    expect(stored.ownerName).toBeUndefined();
  });

  it("alıcı gönderi oluşturamaz ve yüklenen görsel silinir", async () => {
    const buyer = await createSession({ role: "alici" });
    const response = await createPost(buyer.auth);

    expect(response.status).toBe(403);
    expect(await Post.countDocuments()).toBe(0);
  });

  it("profil güncellenince gönderideki sahip bilgisi güncel görünür", async () => {
    const seller = await createSession();
    const { body } = await createPost(seller.auth);

    await api().patch("/api/users/me").set(seller.auth).send({ name: "Güncel" });

    const detail = await api().get(`/api/posts/${body.post._id}`);
    expect(detail.body.user.name).toBe("Güncel");
  });
});

describe("gönderi sahipliği", () => {
  it("başkasının gönderisini güncelleyemez veya silemez", async () => {
    const owner = await createSession();
    const intruder = await createSession();
    const { body } = await createPost(owner.auth);
    const postId = body.post._id;

    const update = await api()
      .patch(`/api/posts/${postId}`)
      .set(intruder.auth)
      .field("title", "Ele geçirildi");
    const remove = await api().delete(`/api/posts/${postId}`).set(intruder.auth);

    expect(update.status).toBe(403);
    expect(remove.status).toBe(403);

    const post = await Post.findById(postId).lean();
    expect(post.title).toBe("Taze süt");
    expect(post.isActive).toBe(true);
  });
});

describe("gönderi görselleri", () => {
  it("güncellemede görsel kaldırılır ve dosya diskten silinir", async () => {
    const owner = await createSession();
    const { body } = await createPost(owner.auth, { images: 2 });
    const [removed, kept] = body.post.images;

    const response = await api()
      .patch(`/api/posts/${body.post._id}`)
      .set(owner.auth)
      .field("removeImages", removed)
      .attach("images", PNG_BYTES, { filename: "yeni.png", contentType: "image/png" });

    expect(response.status).toBe(200);
    expect(response.body.post.images).toHaveLength(2);
    expect(response.body.post.images).toContain(kept);
    expect(response.body.post.images).not.toContain(removed);
    expect((await api().get(removed)).status).toBe(404);
    expect((await api().get(kept)).status).toBe(200);
  });

  it("gönderiye ait olmayan görsel kaldırılamaz", async () => {
    const owner = await createSession();
    const { body } = await createPost(owner.auth);

    const response = await api()
      .patch(`/api/posts/${body.post._id}`)
      .set(owner.auth)
      .field("removeImages", "/uploads/baskasinin.png");

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("IMAGE_NOT_IN_POST");
  });

  it("toplam görsel sınırı aşılamaz", async () => {
    const owner = await createSession();
    const { body } = await createPost(owner.auth, { images: 5 });

    const response = await api()
      .patch(`/api/posts/${body.post._id}`)
      .set(owner.auth)
      .attach("images", PNG_BYTES, { filename: "fazla.png", contentType: "image/png" });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("TOO_MANY_IMAGES");
  });
});

describe("beğeni ve kaydetme", () => {
  it("eşzamanlı beğenilerde sayaç tutarlı kalır", async () => {
    const owner = await createSession();
    const fans = await Promise.all(Array.from({ length: 4 }, () => createSession()));
    const { body } = await createPost(owner.auth);

    await Promise.all(
      fans.flatMap((fan) =>
        Array.from({ length: 3 }, () => api().put(`/api/posts/${body.post._id}/like`).set(fan.auth))
      )
    );

    const post = await Post.findById(body.post._id).lean();
    expect(post.likesCount).toBe(4);
    expect(new Set(post.likes.map(String)).size).toBe(4);
  });

  it("beğeni geri alma idempotenttir", async () => {
    const owner = await createSession();
    const fan = await createSession();
    const { body } = await createPost(owner.auth);

    await api().put(`/api/posts/${body.post._id}/like`).set(fan.auth);
    const first = await api().delete(`/api/posts/${body.post._id}/like`).set(fan.auth);
    const second = await api().delete(`/api/posts/${body.post._id}/like`).set(fan.auth);

    expect(first.body).toMatchObject({ liked: false, likesCount: 0 });
    expect(second.body).toMatchObject({ liked: false, likesCount: 0 });
  });

  it("listelerde izleyiciye özel durum döner, tüm dizi sızmaz", async () => {
    const owner = await createSession();
    const fan = await createSession();
    const { body } = await createPost(owner.auth);

    await api().put(`/api/posts/${body.post._id}/like`).set(fan.auth);
    await api().put(`/api/posts/${body.post._id}/save`).set(fan.auth);
    await api().put(`/api/users/${owner.user._id}/follow`).set(fan.auth);

    const explore = await api().get("/api/posts").set(fan.auth);
    const [item] = explore.body.items;

    expect(item).toMatchObject({
      likedByMe: true,
      savedByMe: true,
      likesCount: 1,
      savesCount: 1,
      isFollowingAuthor: true,
    });
    expect(item.likes).toBeUndefined();
    expect(item.savedBy).toBeUndefined();

    const saved = await api().get("/api/posts/saved").set(fan.auth);
    expect(saved.body.items.map((post) => post._id)).toEqual([body.post._id]);

    const ownerView = await api().get("/api/posts").set(owner.auth);
    expect(ownerView.body.items[0]).toMatchObject({ likedByMe: false, savedByMe: false });
  });
});

describe("akış sayfalama", () => {
  it("keşfet ve takip akışı cursor ile tekrarsız sayfalanır", async () => {
    const seller = await createSession();
    const follower = await createSession();
    await api().put(`/api/users/${seller.user._id}/follow`).set(follower.auth);

    for (let index = 0; index < 5; index += 1) {
      await createPost(seller.auth, { title: `Ürün ${index}`, images: 0 });
    }

    const collect = async (path) => {
      const seen = [];
      let cursor = null;

      do {
        const response = await api()
          .get(`${path}?limit=2${cursor ? `&cursor=${cursor}` : ""}`)
          .set(follower.auth);
        seen.push(...response.body.items.map((post) => post.title));
        cursor = response.body.nextCursor;
      } while (cursor);

      return seen;
    };

    const expected = ["Ürün 4", "Ürün 3", "Ürün 2", "Ürün 1", "Ürün 0"];
    expect(await collect("/api/posts")).toEqual(expected);
    expect(await collect("/api/posts/following")).toEqual(expected);
  });
});

describe("yorumlar", () => {
  it("yorumlar sayfalanır ve beğeni durumu izleyiciye göre döner", async () => {
    const owner = await createSession();
    const commenter = await createSession();
    const { body } = await createPost(owner.auth);

    const comments = [];
    for (const text of ["Bir", "İki", "Üç"]) {
      comments.push(
        (await api().post(`/api/posts/${body.post._id}/comments`).set(commenter.auth).send({ text })).body
      );
    }

    await api().put(`/api/comments/${comments[2]._id}/like`).set(owner.auth);

    const first = await api().get(`/api/posts/${body.post._id}/comments?limit=2`).set(owner.auth);
    expect(first.body.items.map((comment) => comment.text)).toEqual(["Üç", "İki"]);
    expect(first.body.items[0]).toMatchObject({ likedByMe: true, likesCount: 1 });

    const second = await api()
      .get(`/api/posts/${body.post._id}/comments?limit=2&cursor=${first.body.nextCursor}`)
      .set(owner.auth);
    expect(second.body.items.map((comment) => comment.text)).toEqual(["Bir"]);
  });

  it("başkasının yorumunu silemez", async () => {
    const owner = await createSession();
    const commenter = await createSession();
    const intruder = await createSession();
    const { body } = await createPost(owner.auth);

    const comment = await api()
      .post(`/api/posts/${body.post._id}/comments`)
      .set(commenter.auth)
      .send({ text: "Harika ürün" });

    const response = await api().delete(`/api/comments/${comment.body._id}`).set(intruder.auth);

    expect(response.status).toBe(403);
    expect((await Comment.findById(comment.body._id).lean()).isActive).toBe(true);
  });
});
