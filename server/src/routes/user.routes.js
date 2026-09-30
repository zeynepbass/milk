import * as users from "../controllers/user.controller.js";
import { uploadImage } from "../middleware/upload.js";
import { paginationQuery } from "../validators/common.js";
import {
  changeEmailSchema,
  changePasswordSchema,
  changeRoleSchema,
  createFeedbackSchema,
  deleteMeSchema,
  followListSchema,
  listUsersSchema,
  organicStatusSchema,
  updateMeSchema,
  userIdSchema,
} from "../validators/user.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/users", "Kullanıcılar");

routes.get("/me", { summary: "Oturumdaki kullanıcı" }, users.getMe);
routes.patch("/me", { summary: "Profil bilgilerini güncelle", schemas: updateMeSchema }, users.updateMe);
routes.put(
  "/me/password",
  { summary: "Şifre değiştir", schemas: changePasswordSchema },
  users.changePassword
);
routes.put("/me/email", { summary: "E-posta değiştir", schemas: changeEmailSchema }, users.changeEmail);
routes.put(
  "/me/avatar",
  { summary: "Profil fotoğrafı yükle", before: uploadImage("avatar"), files: { field: "avatar" } },
  users.updateAvatar
);
routes.post("/me/freeze", { summary: "Hesabı dondur" }, users.freezeMe);
routes.delete("/me", { summary: "Hesabı sil", schemas: deleteMeSchema }, users.deleteMe);

routes.post(
  "/feedback",
  { summary: "Geri bildirim gönder", schemas: createFeedbackSchema, status: 201 },
  users.createFeedback
);
routes.get(
  "/feedback",
  { summary: "Geri bildirimleri listele", auth: "admin", schemas: { query: paginationQuery } },
  users.getFeedbacks
);
routes.get("/", { summary: "Kullanıcıları listele", auth: "admin", schemas: listUsersSchema }, users.getUsers);
routes.put(
  "/organic-status",
  { summary: "Organik satıcı onayı", auth: "admin", schemas: organicStatusSchema },
  users.updateOrganicStatus
);
routes.patch("/:id/role", { summary: "Rol değiştir", auth: "admin", schemas: changeRoleSchema }, users.changeRole);

routes.get("/:id", { summary: "Kullanıcı profili", auth: "optional", schemas: userIdSchema }, users.getProfile);
routes.get(
  "/:id/posts",
  { summary: "Kullanıcının gönderileri", auth: "optional", schemas: followListSchema },
  users.getUserPosts
);
routes.get("/:id/followers", { summary: "Takipçiler", schemas: followListSchema }, users.getFollowers);
routes.get("/:id/following", { summary: "Takip edilenler", schemas: followListSchema }, users.getFollowing);
routes.put("/:id/follow", { summary: "Takip et", schemas: userIdSchema }, users.follow);
routes.delete("/:id/follow", { summary: "Takipten çık", schemas: userIdSchema }, users.unfollow);

export default routes.router;
