import express from "express";
import {
    getUserConversations,
    getConversationBetweenUsers,
} from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId/:otherUserId", authMiddleware, getConversationBetweenUsers);
router.get("/:userId", authMiddleware, getUserConversations);

export default router;
