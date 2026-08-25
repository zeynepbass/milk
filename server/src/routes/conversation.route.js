import express from "express";
import {
    getUserConversations,
    getConversationBetweenUsers,
} from "../controllers/conversation.controller.js";

const router = express.Router();


router.get("/:userId/:otherUserId", getConversationBetweenUsers);
router.get("/:userId", getUserConversations);

export default router;
