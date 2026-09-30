import * as posts from "../controllers/post.controller.js";
import { uploadImages } from "../middleware/upload.js";
import { RULES } from "../validators/rules.js";
import {
  createPostSchema,
  feedSchema,
  listPostsSchema,
  postIdSchema,
  updatePostSchema,
} from "../validators/post.validators.js";
import { addCommentSchema, listCommentsSchema } from "../validators/comment.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/posts", "Gönderiler");
const imageUpload = uploadImages("images", RULES.postImages.max);
const imageFiles = { field: "images", multiple: true };

routes.get("/", { summary: "Keşfet akışı", schemas: listPostsSchema }, posts.getPosts);
routes.get("/following", { summary: "Takip edilenlerin gönderileri", schemas: feedSchema }, posts.getFollowingPosts);
routes.get("/saved", { summary: "Kaydedilen gönderiler", schemas: feedSchema }, posts.getSavedPosts);
routes.get("/mine", { summary: "Kendi gönderilerim", schemas: feedSchema }, posts.getMyPosts);
routes.post(
  "/",
  { summary: "Gönderi oluştur", before: imageUpload, schemas: createPostSchema, files: imageFiles, status: 201 },
  posts.createPost
);

routes.get("/:id", { summary: "Gönderi detayı", auth: "optional", schemas: postIdSchema }, posts.getPost);
routes.patch(
  "/:id",
  { summary: "Gönderiyi güncelle", before: imageUpload, schemas: updatePostSchema, files: imageFiles },
  posts.updatePost
);
routes.delete("/:id", { summary: "Gönderiyi kaldır", schemas: postIdSchema }, posts.deletePost);
routes.put("/:id/like", { summary: "Beğen", schemas: postIdSchema }, posts.likePost);
routes.delete("/:id/like", { summary: "Beğeniyi geri al", schemas: postIdSchema }, posts.unlikePost);
routes.put("/:id/save", { summary: "Kaydet", schemas: postIdSchema }, posts.savePost);
routes.delete("/:id/save", { summary: "Kaydı kaldır", schemas: postIdSchema }, posts.unsavePost);
routes.get(
  "/:id/comments",
  { summary: "Yorumlar", auth: "optional", schemas: listCommentsSchema },
  posts.getComments
);
routes.post(
  "/:id/comments",
  { summary: "Yorum yap", schemas: addCommentSchema, status: 201 },
  posts.addComment
);

export default routes.router;
