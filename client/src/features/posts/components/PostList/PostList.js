import { EmptyState, LoadMore, QueryState } from "@/shared/components/molecules";
import { flattenPages } from "@/shared/query/infinite";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { PostCard } from "../PostCard";

const byVerifiedSellerFirst = (posts) =>
  [...posts].sort(
    (a, b) => Number(Boolean(b.user?.dogrulanmisSatici)) - Number(Boolean(a.user?.dogrulanmisSatici))
  );

export function PostList({ query, emptyTitle, emptyDescription, prioritizeVerified = false }) {
  const currentUserId = useAuthStore((state) => state.userId);
  const posts = flattenPages(query.data);
  const ordered = prioritizeVerified ? byVerifiedSellerFirst(posts) : posts;

  return (
    <QueryState
      query={query}
      isEmpty={posts.length === 0}
      empty={<EmptyState title={emptyTitle} description={emptyDescription} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ordered.map((post) => (
          <PostCard key={post._id} post={post} currentUserId={currentUserId} />
        ))}
      </div>
      <LoadMore query={query} />
    </QueryState>
  );
}
