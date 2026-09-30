import * as postService from "../services/post.service.js";
import * as commentService from "../services/comment.service.js";
import { uploadedUrls } from "../middleware/upload.js";

export const getPosts = async (req, res) => {
  res.json(await postService.listPosts({ ...req.query, viewerId: req.userId }));
};

export const getFollowingPosts = async (req, res) => {
  res.json(await postService.listFollowingPosts(req.userId, req.query));
};

export const getSavedPosts = async (req, res) => {
  res.json(await postService.listSavedPosts(req.userId, req.query));
};

export const getMyPosts = async (req, res) => {
  res.json(await postService.listUserPosts(req.userId, req.userId, req.query));
};

export const getPost = async (req, res) => {
  res.json(await postService.getPostView(req.params.id, req.userId));
};

export const createPost = async (req, res) => {
  const post = await postService.createPost(req.userId, req.body, uploadedUrls(req));
  res.status(201).json({ message: "İlan başarıyla oluşturuldu.", post });
};

export const updatePost = async (req, res) => {
  const post = await postService.updatePost(req.userId, req.params.id, req.body, uploadedUrls(req));
  res.json({ message: "Gönderi başarıyla güncellendi", post });
};

export const deletePost = async (req, res) => {
  await postService.deletePost(req.userId, req.params.id);
  res.json({ message: "Gönderi kaldırıldı" });
};

export const likePost = async (req, res) => {
  res.json(await postService.likePost(req.userId, req.params.id));
};

export const unlikePost = async (req, res) => {
  res.json(await postService.unlikePost(req.userId, req.params.id));
};

export const savePost = async (req, res) => {
  res.json(await postService.savePost(req.userId, req.params.id));
};

export const unsavePost = async (req, res) => {
  res.json(await postService.unsavePost(req.userId, req.params.id));
};

export const getComments = async (req, res) => {
  res.json(await commentService.listComments(req.params.id, req.userId, req.query));
};

export const addComment = async (req, res) => {
  res.status(201).json(await commentService.addComment(req.userId, req.params.id, req.body.text));
};
