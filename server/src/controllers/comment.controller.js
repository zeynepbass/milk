import * as commentService from "../services/comment.service.js";

export const likeComment = async (req, res) => {
  res.json(await commentService.likeComment(req.userId, req.params.id));
};

export const unlikeComment = async (req, res) => {
  res.json(await commentService.unlikeComment(req.userId, req.params.id));
};

export const deleteComment = async (req, res) => {
  await commentService.deleteComment(req.userId, req.params.id);
  res.json({ message: "Yorum silindi" });
};
