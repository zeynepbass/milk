import { describe, expect, it } from "vitest";
import Follow from "../src/models/Follow.js";
import User from "../src/models/User.js";
import { api, createSession } from "./helpers.js";

const counts = async (userId) => {
  const user = await User.findById(userId).lean();
  return { followers: user.followersCount, following: user.followingCount };
};

describe("takip ilişkisi", () => {
  it("takip et ve takipten çık sayaçları iki tarafta da günceller", async () => {
    const target = await createSession();
    const { user, auth } = await createSession();

    const follow = await api().put(`/api/users/${target.user._id}/follow`).set(auth);
    expect(follow.body.following).toBe(true);
    expect(await counts(user._id)).toEqual({ followers: 0, following: 1 });
    expect(await counts(target.user._id)).toEqual({ followers: 1, following: 0 });

    const unfollow = await api().delete(`/api/users/${target.user._id}/follow`).set(auth);
    expect(unfollow.body.following).toBe(false);
    expect(await counts(user._id)).toEqual({ followers: 0, following: 0 });
    expect(await counts(target.user._id)).toEqual({ followers: 0, following: 0 });
  });

  it("eşzamanlı takip isteklerinde tek ilişki ve doğru sayaç oluşur", async () => {
    const target = await createSession();
    const { user, auth } = await createSession();

    const responses = await Promise.all(
      Array.from({ length: 8 }, () => api().put(`/api/users/${target.user._id}/follow`).set(auth))
    );

    expect(responses.every((response) => response.status === 200)).toBe(true);
    expect(await Follow.countDocuments({ follower: user._id, following: target.user._id })).toBe(1);
    expect(await counts(target.user._id)).toEqual({ followers: 1, following: 0 });
    expect(await counts(user._id)).toEqual({ followers: 0, following: 1 });
  });

  it("eşzamanlı takipten çıkma istekleri sayacı negatife düşürmez", async () => {
    const target = await createSession();
    const { auth } = await createSession();
    await api().put(`/api/users/${target.user._id}/follow`).set(auth);

    await Promise.all(
      Array.from({ length: 6 }, () => api().delete(`/api/users/${target.user._id}/follow`).set(auth))
    );

    expect(await counts(target.user._id)).toEqual({ followers: 0, following: 0 });
  });

  it("kendini takip edemez", async () => {
    const { user, auth } = await createSession();
    const response = await api().put(`/api/users/${user._id}/follow`).set(auth);

    expect(response.status).toBe(400);
  });

  it("takipçi ve takip edilen listeleri cursor ile sayfalanır", async () => {
    const target = await createSession();
    const followers = await Promise.all(Array.from({ length: 3 }, () => createSession()));

    for (const follower of followers) {
      await api().put(`/api/users/${target.user._id}/follow`).set(follower.auth);
    }

    const first = await api().get(`/api/users/${target.user._id}/followers?limit=2`).set(followers[0].auth);
    const second = await api()
      .get(`/api/users/${target.user._id}/followers?limit=2&cursor=${first.body.nextCursor}`)
      .set(followers[0].auth);

    expect(first.body.items).toHaveLength(2);
    expect(second.body.items).toHaveLength(1);
    expect(second.body.nextCursor).toBeNull();

    const ids = [...first.body.items, ...second.body.items].map((item) => item._id).sort();
    expect(ids).toEqual(followers.map((follower) => follower.user._id).sort());

    const following = await api().get(`/api/users/${followers[0].user._id}/following`).set(followers[0].auth);
    expect(following.body.items.map((item) => item._id)).toEqual([target.user._id]);
  });

  it("geçersiz cursor 400 döner", async () => {
    const { user, auth } = await createSession();
    const response = await api().get(`/api/users/${user._id}/followers?cursor=bozuk`).set(auth);

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_CURSOR");
  });
});
