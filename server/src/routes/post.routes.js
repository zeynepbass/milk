import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload  from "../middleware/multer.js";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  toggleLikePost,
  toggleSavePost,
  getMyPosts,
  getSavedPosts,
  updatePost,
  getFollowingPosts,
  getNotifications,
  markAsRead
} from "../controllers/post.controller.js";

const router = express.Router();
//bitti
router.get("/", authMiddleware,getPosts);

router.get("/following", authMiddleware, getFollowingPosts);
 router.get("/notifications", authMiddleware, getNotifications);
 router.put("/markAsRead/:id", authMiddleware, markAsRead);
//bitti
router.post("/:id/like/post", authMiddleware, toggleLikePost);

//bitti
router.get("/user/me", authMiddleware, getMyPosts);

//bitti
router.post("/", authMiddleware, upload.array("images", 5),createPost);
router.put("/:id",authMiddleware,upload.array("images", 5), updatePost);
//bitti
router.post("/:id/save", authMiddleware, toggleSavePost);
//devam
router.get("/users/saved-posts", authMiddleware, getSavedPosts);
//bitti
router.delete("/:id", authMiddleware, deletePost);

//bitti
router.get("/:id", getPostById); 


export default router;
