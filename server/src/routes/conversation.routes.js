import express from "express";
import { getConversationWithUser, getMyConversations } from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { conversationWithSchema } from "../validators/message.validators.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyConversations);
router.get("/with/:userId", validate(conversationWithSchema), getConversationWithUser);

export default router;
