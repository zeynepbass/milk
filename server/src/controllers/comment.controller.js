import * as commentService from "../services/comment.service.js";

export const getComments = async (req, res) => {
  res.json(await commentService.listComments(req.params.id));
};

export const addComment = async (req, res) => {
  res.status(201).json(await commentService.addComment(req.userId, req.params.id, req.body.text));
};

export const toggleLikeComment = async (req, res) => {
  res.json(await commentService.toggleLike(req.userId, req.params.id));
};

export const deleteComment = async (req, res) => {
  await commentService.deleteComment(req.userId, req.params.id);
  res.json({ message: "Yorum silindi" });
};
