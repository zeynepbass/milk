import { commentApi } from "@/features/feed/api/comment.api";
import { commentRepository } from "@/features/feed/repositories/comment.repository";
import { commentService } from "@/features/feed/services/comment.service";

export const commentProvider = {
  api: commentApi,
  repository: commentRepository,
  service: commentService,
};