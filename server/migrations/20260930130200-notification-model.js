const resolveActor = async (db, notification) => {
  const sender = notification.senderId?.toString();

  if (sender && sender !== notification.userId?.toString()) {
    return notification.senderId;
  }

  if (!notification.postId) return null;

  const post = await db
    .collection("posts")
    .findOne({ _id: notification.postId }, { projection: { user: 1 } });
  return post?.user ?? null;
};

export const up = async (db) => {
  const legacy = db.collection("notifications").find({ userId: { $exists: true } });

  for await (const notification of legacy) {
    const actor = await resolveActor(db, notification);

    if (!actor || !notification.postId) {
      await db.collection("notifications").deleteOne({ _id: notification._id });
      continue;
    }

    await db.collection("notifications").updateOne(
      { _id: notification._id },
      {
        $set: {
          recipient: notification.userId,
          actor,
          type: "new_post",
          entity: { kind: "post", id: notification.postId },
          groupKey: `new_post:${actor}`,
          count: 1,
          lastActivityAt: notification.createdAt ?? new Date(),
        },
        $unset: { userId: "", senderId: "", postId: "", name: "", surname: "", province: "", date: "" },
      }
    );
  }
};

export const down = async () => {};
