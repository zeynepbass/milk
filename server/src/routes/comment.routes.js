import express from "express";
import {
  addComment,
  deleteComment,
  toggleLikeComment,
  getComment
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:id", authMiddleware, addComment);
router.get("/:id",authMiddleware, getComment);
router.post("/:id/like", authMiddleware, toggleLikeComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;
