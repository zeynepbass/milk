import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
  toggleLikeComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { addCommentSchema, commentIdSchema } from "../validators/comment.validators.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:id", validate(commentIdSchema), getComments);
router.post("/:id", validate(addCommentSchema), addComment);
router.post("/:id/like", validate(commentIdSchema), toggleLikeComment);
router.delete("/:id", validate(commentIdSchema), deleteComment);

export default router;
