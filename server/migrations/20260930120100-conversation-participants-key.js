const buildKey = (participants) => participants.map(String).sort().join(":");

const mergeInto = async (db, target, duplicates) => {
  const duplicateIds = duplicates.map((conversation) => conversation._id);

  await db
    .collection("messages")
    .updateMany({ conversationId: { $in: duplicateIds } }, { $set: { conversationId: target._id } });

  await db.collection("conversations").deleteMany({ _id: { $in: duplicateIds } });
};

const refreshLastMessage = async (db, conversationId) => {
  const [latest] = await db
    .collection("messages")
    .find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();

  if (latest) {
    await db
      .collection("conversations")
      .updateOne({ _id: conversationId }, { $set: { lastMessage: latest.text, lastMessageAt: latest.createdAt } });
  }
};

export const up = async (db) => {
  const conversations = await db
    .collection("conversations")
    .find({ participantsKey: { $exists: false }, "participants.1": { $exists: true } })
    .toArray();

  const groups = new Map();
  for (const conversation of conversations) {
    const key = buildKey(conversation.participants);
    groups.set(key, [...(groups.get(key) ?? []), conversation]);
  }

  for (const [key, group] of groups) {
    const existing = await db.collection("conversations").findOne({ participantsKey: key });
    const [target, ...duplicates] = existing ? [existing, ...group] : group;

    if (duplicates.length > 0) {
      await mergeInto(db, target, duplicates);
    }

    await db.collection("conversations").updateOne({ _id: target._id }, { $set: { participantsKey: key } });
    await refreshLastMessage(db, target._id);
  }
};

export const down = async (db) => {
  await db.collection("conversations").updateMany({}, { $unset: { participantsKey: "" } });
};
