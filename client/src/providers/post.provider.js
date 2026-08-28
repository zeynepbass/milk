import { postApi } from "@/features/feed/api/post.api";
import { postRepository } from "@/features/feed/repositories/post.repository";
import { postService } from "@/features/feed/services/post.service";

export const postProvider = {
  api: postApi,
  repository: postRepository,
  service: postService,
};