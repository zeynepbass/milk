import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import User from "../src/models/User.js";
import Post from "../src/models/Post.js";
import Follow from "../src/models/Follow.js";
import { hashPassword } from "../src/services/auth.service.js";
import { logger } from "../src/utils/logger.js";

export const DEMO_PASSWORD = "Demo12345!";

const DEMO_USERS = [
  { key: "admin", name: "Ada", surname: "Yönetici", email: "admin@milk.demo", role: "admin", province: "İzmir" },
  {
    key: "seller",
    name: "Mehmet",
    surname: "Üretici",
    email: "satici@milk.demo",
    role: "satici",
    province: "İzmir",
    district: "Tire",
    organicStatus: true,
    dogrulanmisSatici: true,
  },
  { key: "buyer", name: "Ayşe", surname: "Alıcı", email: "alici@milk.demo", role: "alici", province: "İzmir" },
];

const DEMO_POSTS = [
  { title: "Günlük inek sütü", category: "sut_urunleri", description: "Sabah sağımı, soğuk zincirle teslim." },
  { title: "Süzme çiçek balı", category: "bal", description: "Tire yaylalarından, 850 gramlık cam kavanoz." },
  { title: "Soğuk sıkım zeytinyağı", category: "zeytinyagi", description: "Erken hasat, 5 litrelik teneke." },
  { title: "Tulum peyniri", category: "peynir", description: "Altı ay olgunlaştırılmış keçi tulumu." },
];

const upsertUser = async ({ key: _key, ...user }, passwordHash) =>
  User.findOneAndUpdate(
    { email: user.email },
    { $set: { ...user, password: passwordHash, status: true, deletedAt: null } },
    { upsert: true, returnDocument: "after" }
  );

export const seed = async () => {
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const users = {};

  for (const demoUser of DEMO_USERS) {
    users[demoUser.key] = await upsertUser(demoUser, passwordHash);
  }

  if ((await Post.countDocuments({ user: users.seller._id })) === 0) {
    await Post.insertMany(
      DEMO_POSTS.map((post) => ({ ...post, user: users.seller._id, province: "İzmir", district: "Tire" }))
    );
  }

  const follow = await Follow.updateOne(
    { follower: users.buyer._id, following: users.seller._id },
    { $setOnInsert: { follower: users.buyer._id, following: users.seller._id } },
    { upsert: true }
  );

  if (follow.upsertedCount > 0) {
    await User.updateOne({ _id: users.buyer._id }, { $inc: { followingCount: 1 } });
    await User.updateOne({ _id: users.seller._id }, { $inc: { followersCount: 1 } });
  }

  return users;
};

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (isDirectRun) {
  mongoose
    .connect(env.mongoUri)
    .then(seed)
    .then(() => {
      logger.info(
        { accounts: DEMO_USERS.map((user) => user.email), password: DEMO_PASSWORD },
        "Demo hesaplar hazır"
      );
    })
    .catch((err) => {
      logger.error({ err }, "Seed başarısız");
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}
