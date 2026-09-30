import express from "express";
import {
  changeEmail,
  changePassword,
  changeRole,
  createFeedback,
  deleteMe,
  followUser,
  freezeMe,
  getFeedbacks,
  getMe,
  getUsers,
  updateAvatar,
  updateMe,
  updateOrganicStatus,
} from "../controllers/user.controller.js";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { uploadImage } from "../middleware/upload.js";
import {
  changeEmailSchema,
  changePasswordSchema,
  changeRoleSchema,
  createFeedbackSchema,
  deleteMeSchema,
  followSchema,
  listUsersSchema,
  organicStatusSchema,
  updateMeSchema,
} from "../validators/user.validators.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.patch("/me", validate(updateMeSchema), updateMe);
router.put("/me/password", validate(changePasswordSchema), changePassword);
router.put("/me/email", validate(changeEmailSchema), changeEmail);
router.put("/me/avatar", uploadImage("avatar"), updateAvatar);
router.post("/me/freeze", freezeMe);
router.delete("/me", validate(deleteMeSchema), deleteMe);

router.post("/follow/:id", validate(followSchema), followUser);
router.post("/feedback", validate(createFeedbackSchema), createFeedback);

router.get("/feedback", adminOnly, getFeedbacks);
router.get("/", adminOnly, validate(listUsersSchema), getUsers);
router.put("/organicStatus", adminOnly, validate(organicStatusSchema), updateOrganicStatus);
router.patch("/:id/role", adminOnly, validate(changeRoleSchema), changeRole);

export default router;
