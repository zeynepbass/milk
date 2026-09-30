let io = null;

export const userRoom = (userId) => `user:${userId.toString()}`;

export const attachSocketServer = (server) => {
  io = server;
};

export const detachSocketServer = () => {
  io = null;
};

export const emitToUsers = (userIds, event, payload) => {
  if (!io) return;
  io.to(userIds.map(userRoom)).emit(event, payload);
};

export const disconnectUser = (userId) => {
  if (!io) return;
  io.in(userRoom(userId)).disconnectSockets(true);
};
