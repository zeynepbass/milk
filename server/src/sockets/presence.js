const REDIS_PRESENCE_KEY = "milk:presence";

export const createMemoryPresence = () => {
  const connections = new Map();

  return {
    async connect(userId) {
      const count = connections.get(userId) ?? 0;
      connections.set(userId, count + 1);
      return count === 0;
    },

    async disconnect(userId) {
      const count = connections.get(userId) ?? 0;

      if (count <= 1) {
        connections.delete(userId);
        return true;
      }

      connections.set(userId, count - 1);
      return false;
    },

    async list() {
      return [...connections.keys()];
    },

    async reset() {
      connections.clear();
    },
  };
};

export const createRedisPresence = (client) => ({
  async connect(userId) {
    return (await client.hIncrBy(REDIS_PRESENCE_KEY, userId, 1)) === 1;
  },

  async disconnect(userId) {
    const remaining = await client.hIncrBy(REDIS_PRESENCE_KEY, userId, -1);

    if (remaining <= 0) {
      await client.hDel(REDIS_PRESENCE_KEY, userId);
      return true;
    }

    return false;
  },

  async list() {
    return client.hKeys(REDIS_PRESENCE_KEY);
  },

  async reset() {
    await client.del(REDIS_PRESENCE_KEY);
  },
});
