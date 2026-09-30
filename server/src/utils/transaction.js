import mongoose from "mongoose";

const TRANSACTIONAL_TOPOLOGIES = new Set(["ReplicaSetWithPrimary", "Sharded", "LoadBalanced"]);

export const supportsTransactions = () => {
  const type = mongoose.connection.getClient()?.topology?.description?.type;
  return TRANSACTIONAL_TOPOLOGIES.has(type);
};

export const withTransaction = async (work) => {
  if (!supportsTransactions()) {
    return work(null);
  }

  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
};
