import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/apiClient";
import { queryKeys } from "@/shared/query/queryKeys";
import { pageParamsFromCursor } from "@/shared/query/infinite";
import { restorePosts, snapshotPosts, updatePostsByAuthor } from "@/features/posts/hooks/postCache";
import { userService } from "../services/user.service";

export function useUserProfile(userId) {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => userService.getProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useFollowList(userId, relation) {
  return useInfiniteQuery({
    queryKey:
      relation === "followers" ? queryKeys.users.followers(userId) : queryKeys.users.following(userId),
    queryFn: ({ pageParam }) => userService.getRelations(userId, relation, { cursor: pageParam }),
    enabled: Boolean(userId && relation),
    ...pageParamsFromCursor,
  });
}

const adjust = (value, delta) => Math.max(0, (value ?? 0) + delta);

export function useFollowToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, following }) => userService.setFollow(userId, following),
    onMutate: async ({ userId, following }) => {
      const delta = following ? 1 : -1;
      const snapshot = snapshotPosts(queryClient);
      const previousProfile = queryClient.getQueryData(queryKeys.users.profile(userId));
      const previousMe = queryClient.getQueryData(queryKeys.me);

      updatePostsByAuthor(queryClient, userId, (post) => ({ ...post, isFollowingAuthor: following }));
      queryClient.setQueryData(queryKeys.users.profile(userId), (profile) =>
        profile && profile.isFollowing !== following
          ? { ...profile, isFollowing: following, followersCount: adjust(profile.followersCount, delta) }
          : profile
      );
      queryClient.setQueryData(queryKeys.me, (me) =>
        me ? { ...me, followingCount: adjust(me.followingCount, delta) } : me
      );

      return { snapshot, previousProfile, previousMe };
    },
    onError: (error, { userId }, context) => {
      restorePosts(queryClient, context?.snapshot);
      queryClient.setQueryData(queryKeys.users.profile(userId), context?.previousProfile);
      queryClient.setQueryData(queryKeys.me, context?.previousMe);
      toast.error(getErrorMessage(error, "Takip işlemi başarısız oldu."));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list("following") });
    },
  });
}
