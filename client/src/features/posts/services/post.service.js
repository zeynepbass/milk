import { postRepository } from "../repositories/post.repository";

const compactParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

const appendIfPresent = (formData, key, value) => {
  if (value !== undefined && value !== null) formData.append(key, value);
};

export const toPostFormData = ({ values, files = [], removeImages = [] }) => {
  const formData = new FormData();

  ["title", "description", "category", "province", "district"].forEach((key) =>
    appendIfPresent(formData, key, values[key])
  );
  files.forEach((file) => formData.append("images", file));
  removeImages.forEach((url) => formData.append("removeImages", url));

  return formData;
};

export const postService = {
  getFeed: (scope, { cursor, search, ...filters } = {}) =>
    postRepository.getFeed(scope, compactParams({ cursor, title: search?.trim(), ...filters })),

  getUserPosts: (userId, { cursor } = {}) => postRepository.getUserPosts(userId, compactParams({ cursor })),

  getPost: (postId) => postRepository.getPost(postId),

  createPost: ({ values, files }) => postRepository.createPost(toPostFormData({ values, files })),

  updatePost: (postId, { values, files, removeImages }) =>
    postRepository.updatePost(postId, toPostFormData({ values, files, removeImages })),

  deletePost: (postId) => postRepository.deletePost(postId),

  setLike: (postId, liked) => postRepository.setLike(postId, liked),

  setSave: (postId, saved) => postRepository.setSave(postId, saved),
};
