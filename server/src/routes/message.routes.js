import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { sendMessageSchema } from "../validators/message.validators.js";

const router = express.Router();

router.post("/", authMiddleware, validate(sendMessageSchema), sendMessage);

export default router;
