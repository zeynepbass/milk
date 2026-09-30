import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/query/queryKeys";
import { pageParamsFromCursor } from "@/shared/query/infinite";
import { postService } from "../services/post.service";

export function usePostFeed(scope, params = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.list(scope, params),
    queryFn: ({ pageParam }) => postService.getFeed(scope, { ...params, cursor: pageParam }),
    ...pageParamsFromCursor,
  });
}

export function useUserPosts(userId) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.list("user", { userId }),
    queryFn: ({ pageParam }) => postService.getUserPosts(userId, { cursor: pageParam }),
    enabled: Boolean(userId),
    ...pageParamsFromCursor,
  });
}

export function usePost(postId) {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: () => postService.getPost(postId),
    enabled: Boolean(postId),
  });
}
