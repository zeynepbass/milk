const BATCH_SIZE = 1000;

const copyFollowArrays = async (db) => {
  const users = db
    .collection("users")
    .find({ following: { $exists: true, $ne: [] } }, { projection: { following: 1 } });

  let operations = [];

  for await (const user of users) {
    for (const targetId of user.following) {
      if (targetId.toString() === user._id.toString()) continue;

      operations.push({
        updateOne: {
          filter: { follower: user._id, following: targetId },
          update: { $setOnInsert: { follower: user._id, following: targetId, createdAt: new Date() } },
          upsert: true,
        },
      });
    }

    if (operations.length >= BATCH_SIZE) {
      await db.collection("follows").bulkWrite(operations, { ordered: false });
      operations = [];
    }
  }

  if (operations.length > 0) {
    await db.collection("follows").bulkWrite(operations, { ordered: false });
  }
};

const recomputeCounts = async (db, groupField, counterField) => {
  await db.collection("users").updateMany({}, { $set: { [counterField]: 0 } });

  const counts = db
    .collection("follows")
    .aggregate([{ $group: { _id: `$${groupField}`, count: { $sum: 1 } } }]);

  for await (const row of counts) {
    await db.collection("users").updateOne({ _id: row._id }, { $set: { [counterField]: row.count } });
  }
};

export const up = async (db) => {
  await db.collection("follows").createIndex({ follower: 1, following: 1 }, { unique: true });

  await copyFollowArrays(db);
  await recomputeCounts(db, "follower", "followingCount");
  await recomputeCounts(db, "following", "followersCount");

  await db.collection("users").updateMany({}, { $unset: { followers: "", following: "", isOnline: "" } });
};

export const down = async (db) => {
  const follows = db.collection("follows").find({});

  for await (const relation of follows) {
    await db
      .collection("users")
      .updateOne({ _id: relation.follower }, { $addToSet: { following: relation.following } });
    await db
      .collection("users")
      .updateOne({ _id: relation.following }, { $addToSet: { followers: relation.follower } });
  }
};
