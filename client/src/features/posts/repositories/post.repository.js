import { postApi } from "../api/post.api";

const unwrap = async (request) => (await request).data;

export const postRepository = {
  getFeed: (scope, params) => unwrap(postApi.getFeed(scope, params)),
  getUserPosts: (userId, params) => unwrap(postApi.getUserPosts(userId, params)),
  getPost: (postId) => unwrap(postApi.getPost(postId)),
  createPost: (formData) => unwrap(postApi.createPost(formData)),
  updatePost: (postId, formData) => unwrap(postApi.updatePost(postId, formData)),
  deletePost: (postId) => unwrap(postApi.deletePost(postId)),
  setLike: (postId, liked) => unwrap(postApi.setLike(postId, liked)),
  setSave: (postId, saved) => unwrap(postApi.setSave(postId, saved)),
};
