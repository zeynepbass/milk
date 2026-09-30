import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadImages } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  createPost,
  deletePost,
  getFollowingPosts,
  getMyPosts,
  getPostById,
  getPosts,
  getSavedPosts,
  toggleLikePost,
  toggleSavePost,
  updatePost,
} from "../controllers/post.controller.js";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import {
  createPostSchema,
  limitOnlySchema,
  listPostsSchema,
  postIdSchema,
  updatePostSchema,
} from "../validators/post.validators.js";
import { notificationIdSchema } from "../validators/message.validators.js";

const router = express.Router();

router.get("/", authMiddleware, validate(listPostsSchema), getPosts);
router.get("/following", authMiddleware, validate(limitOnlySchema), getFollowingPosts);
router.get("/notifications", authMiddleware, getNotifications);
router.put("/markAsRead/:id", authMiddleware, validate(notificationIdSchema), markAsRead);
router.get("/user/me", authMiddleware, validate(limitOnlySchema), getMyPosts);
router.get("/users/saved-posts", authMiddleware, validate(limitOnlySchema), getSavedPosts);

router.post("/", authMiddleware, uploadImages("images", 5), validate(createPostSchema), createPost);
router.put("/:id", authMiddleware, uploadImages("images", 5), validate(updatePostSchema), updatePost);
router.delete("/:id", authMiddleware, validate(postIdSchema), deletePost);
router.post("/:id/like/post", authMiddleware, validate(postIdSchema), toggleLikePost);
router.post("/:id/save", authMiddleware, validate(postIdSchema), toggleSavePost);

router.get("/:id", validate(postIdSchema), getPostById);

export default router;
