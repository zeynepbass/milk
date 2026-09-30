import express from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { authLimiter, loginLimiter, refreshLimiter } from "../middleware/rateLimiter.js";
import { requireAllowedOrigin } from "../middleware/originCheck.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, loginLimiter, validate(loginSchema), login);
router.post("/refresh", refreshLimiter, requireAllowedOrigin, refresh);
router.post("/logout", requireAllowedOrigin, logout);

export default router;
