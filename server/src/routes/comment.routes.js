import * as comments from "../controllers/comment.controller.js";
import { commentIdSchema } from "../validators/comment.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/comments", "Yorumlar");

routes.put("/:id/like", { summary: "Yorumu beğen", schemas: commentIdSchema }, comments.likeComment);
routes.delete(
  "/:id/like",
  { summary: "Yorum beğenisini geri al", schemas: commentIdSchema },
  comments.unlikeComment
);
routes.delete("/:id", { summary: "Yorumu sil", schemas: commentIdSchema }, comments.deleteComment);

export default routes.router;
