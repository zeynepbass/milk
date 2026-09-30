import { postApi } from "../api/post.api";

const unwrap = async (request) => (await request).data;

export const postRepository = {
  getPosts: (params) => unwrap(postApi.getPosts(params)),
  getFollowingPosts: (params) => unwrap(postApi.getFollowingPosts(params)),
  getSavedPosts: () => unwrap(postApi.getSavedPosts()),
  getMyPosts: () => unwrap(postApi.getMyPosts()),
  getPostDetails: (id) => unwrap(postApi.getPostDetails(id)),
  createPost: (formData) => unwrap(postApi.createPost(formData)),
  updatePost: (id, formData) => unwrap(postApi.updatePost(id, formData)),
  deletePost: (id) => unwrap(postApi.deletePost(id)),
  likePost: (id) => unwrap(postApi.likePost(id)),
  savePost: (id) => unwrap(postApi.savePost(id)),
};
