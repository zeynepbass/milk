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

const router = express.Router();

//bitti
router.post("/register", register);
router.post("/login", login);
router.get("/feedback",  authMiddleware, adminOnly, getFeetBack);
router.post("/feedback",  authMiddleware, createFeedback);
//bitti
router.get("/profile", authMiddleware, getProfile);
router.put("/updateUser",authMiddleware, updateUser);
router.put("/organicStatus",authMiddleware, updateUserStatus);
//bitti
router.post("/follow/:id", authMiddleware, followUser);
//bitti
router.get("/", getUsers);
router.put("/freeze", authMiddleware, freezeUser);
router.delete("/:id",authMiddleware, deleteUser);
export default router;
