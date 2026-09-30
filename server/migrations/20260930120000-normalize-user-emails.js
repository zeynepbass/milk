const findCollidingEmails = (db) =>
  db
    .collection("users")
    .aggregate([
      { $match: { email: { $type: "string" } } },
      { $group: { _id: { $toLower: { $trim: { input: "$email" } } }, ids: { $push: "$_id" }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

export const up = async (db) => {
  const collisions = await findCollidingEmails(db);

  if (collisions.length > 0) {
    const report = collisions.map((group) => `${group._id}: ${group.ids.join(", ")}`).join("\n");
    throw new Error(`Büyük/küçük harf farkıyla çakışan e-postalar var, önce elle birleştirin:\n${report}`);
  }

  await db
    .collection("users")
    .updateMany({ email: { $type: "string" } }, [{ $set: { email: { $toLower: { $trim: { input: "$email" } } } } }]);
};

export const down = async () => {};
