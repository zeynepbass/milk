const connectionsByUser = new Map();

export const markOnline = (userId) => {
  const count = connectionsByUser.get(userId) ?? 0;
  connectionsByUser.set(userId, count + 1);
  return count === 0;
};

export const markOffline = (userId) => {
  const count = connectionsByUser.get(userId) ?? 0;

  if (count <= 1) {
    connectionsByUser.delete(userId);
    return true;
  }

  connectionsByUser.set(userId, count - 1);
  return false;
};

export const listOnlineUserIds = () => Array.from(connectionsByUser.keys());

export const resetPresence = () => connectionsByUser.clear();
