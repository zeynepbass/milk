import { userApi } from "../api/user.api";

const unwrap = async (request) => (await request).data;

export const userRepository = {
  getProfile: (userId) => unwrap(userApi.getProfile(userId)),
  getFollowers: (userId, params) => unwrap(userApi.getFollowers(userId, params)),
  getFollowing: (userId, params) => unwrap(userApi.getFollowing(userId, params)),
  setFollow: (userId, following) => unwrap(userApi.setFollow(userId, following)),
};
