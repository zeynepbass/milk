export const up = async (db) => {
  await db.collection("posts").updateMany({}, [
    {
      $set: {
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        savesCount: { $size: { $ifNull: ["$savedBy", []] } },
        images: { $ifNull: ["$images", []] },
      },
    },
    { $unset: ["ownerName", "ownerSurname", "ownerRole", "image"] },
  ]);

  await db
    .collection("comments")
    .updateMany({}, [{ $set: { likesCount: { $size: { $ifNull: ["$likes", []] } } } }]);
};

export const down = async (db) => {
  const posts = db.collection("posts").find({}, { projection: { user: 1 } });

  for await (const post of posts) {
    const owner = await db.collection("users").findOne({ _id: post.user });
    if (!owner) continue;

    await db.collection("posts").updateOne(
      { _id: post._id },
      {
        $set: {
          ownerName: owner.name,
          ownerSurname: owner.surname,
          ownerRole: owner.role === "alici" ? "alici" : "satici",
          image: owner.avatar,
        },
      }
    );
  }
};
