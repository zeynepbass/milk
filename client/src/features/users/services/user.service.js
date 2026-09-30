import { userRepository } from "../repositories/user.repository";

const withCursor = (cursor) => (cursor ? { cursor } : undefined);

export const userService = {
  getProfile: (userId) => userRepository.getProfile(userId),

  getRelations: (userId, relation, { cursor } = {}) =>
    relation === "followers"
      ? userRepository.getFollowers(userId, withCursor(cursor))
      : userRepository.getFollowing(userId, withCursor(cursor)),

  setFollow: (userId, following) => userRepository.setFollow(userId, following),
};
