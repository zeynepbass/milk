import * as postService from "../services/post.service.js";
import { getLimit } from "../utils/pagination.js";

export const getPosts = async (req, res) => {
  res.json(await postService.listPosts({ ...req.query, limit: getLimit(req) }));
};

export const getFollowingPosts = async (req, res) => {
  res.json(await postService.listFollowingPosts(req.userId, getLimit(req)));
};

export const getSavedPosts = async (req, res) => {
  res.json(await postService.listSavedPosts(req.userId, getLimit(req)));
};

export const getMyPosts = async (req, res) => {
  res.json(await postService.listMyPosts(req.userId, getLimit(req)));
};

export const getPostById = async (req, res) => {
  res.json(await postService.getPostWithComments(req.params.id));
};

export const createPost = async (req, res) => {
  const post = await postService.createPost(req.userId, req.body, req.files);
  res.status(201).json({ message: "İlan başarıyla oluşturuldu.", post });
};

export const updatePost = async (req, res) => {
  const post = await postService.updatePost(req.userId, req.params.id, req.body, req.files);
  res.json({ message: "Gönderi başarıyla güncellendi", post });
};

export const deletePost = async (req, res) => {
  await postService.deletePost(req.userId, req.params.id);
  res.json({ message: "Gönderi kaldırıldı" });
};

export const toggleLikePost = async (req, res) => {
  res.json(await postService.toggleLike(req.userId, req.params.id));
};

export const toggleSavePost = async (req, res) => {
  res.json(await postService.toggleSave(req.userId, req.params.id));
};
