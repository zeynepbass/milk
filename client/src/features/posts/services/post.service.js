import { postRepository } from "../repositories/post.repository";

const toSearchParams = (search) => (search?.trim() ? { title: search.trim() } : undefined);

const requireId = (id) => {
  if (!id) throw new Error("Gönderi bulunamadı.");
  return id;
};

export const postService = {
  getPosts: ({ search } = {}) => postRepository.getPosts(toSearchParams(search)),
  getFollowingPosts: ({ search } = {}) => postRepository.getFollowingPosts(toSearchParams(search)),
  getSavedPosts: () => postRepository.getSavedPosts(),
  getMyPosts: () => postRepository.getMyPosts(),
  getPostDetails: (id) => postRepository.getPostDetails(requireId(id)),
  createPost: (formData) => postRepository.createPost(formData),
  updatePost: (id, formData) => postRepository.updatePost(requireId(id), formData),
  deletePost: (id) => postRepository.deletePost(requireId(id)),
  likePost: (id) => postRepository.likePost(requireId(id)),
  savePost: (id) => postRepository.savePost(requireId(id)),
};
