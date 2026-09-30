import { queryKeys } from "@/shared/query/queryKeys";
import { filterInfiniteItems, mapInfiniteItems } from "@/shared/query/infinite";

const isInfinite = (data) => Boolean(data?.pages);

const POST_QUERIES = {
  queryKey: queryKeys.posts.all,
  predicate: (query) => ["list", "detail"].includes(query.queryKey[1]),
};

export const snapshotPosts = (queryClient) => queryClient.getQueriesData(POST_QUERIES);

export const restorePosts = (queryClient, snapshot = []) => {
  snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
};

export const updatePostEverywhere = (queryClient, postId, update) => {
  queryClient.setQueriesData(POST_QUERIES, (data) => {
    if (!data) return data;
    if (isInfinite(data))
      return mapInfiniteItems(data, (post) => (post._id === postId ? update(post) : post));
    return data._id === postId ? update(data) : data;
  });
};

export const updatePostsByAuthor = (queryClient, authorId, update) => {
  queryClient.setQueriesData(POST_QUERIES, (data) => {
    if (!data) return data;
    const apply = (post) => (post.user?._id === authorId ? update(post) : post);
    return isInfinite(data) ? mapInfiniteItems(data, apply) : data._id ? apply(data) : data;
  });
};

export const removePostEverywhere = (queryClient, postId) => {
  queryClient.setQueriesData({ queryKey: queryKeys.posts.lists() }, (data) =>
    isInfinite(data) ? filterInfiniteItems(data, (post) => post._id !== postId) : data
  );
};

export const applyLike = (liked) => (post) => ({
  ...post,
  likedByMe: liked,
  likesCount: Math.max(0, (post.likesCount ?? 0) + (liked === post.likedByMe ? 0 : liked ? 1 : -1)),
});

export const applySave = (saved) => (post) => ({
  ...post,
  savedByMe: saved,
  savesCount: Math.max(0, (post.savesCount ?? 0) + (saved === post.savedByMe ? 0 : saved ? 1 : -1)),
});
