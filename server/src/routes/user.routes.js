import express from "express";
import {
  register,
  login,
  getProfile,
  followUser,
  updateUser,
  deleteUser,
  freezeUser,
  getUsers,
  updateUserStatus,
  createFeedback,
  getFeetBack
} from "../controllers/user.controller.js";
import { authMiddleware,adminOnly } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();


router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/feedback",  authMiddleware, adminOnly, getFeetBack);
router.post("/feedback",  authMiddleware, createFeedback);

router.get("/profile", authMiddleware, getProfile);
router.put("/updateUser",authMiddleware, updateUser);
router.put("/organicStatus",authMiddleware, adminOnly, updateUserStatus);

router.post("/follow/:id", authMiddleware, followUser);

router.get("/", authMiddleware, adminOnly, getUsers);
router.put("/freeze", authMiddleware, freezeUser);
router.delete("/:id",authMiddleware, deleteUser);
export default router;
