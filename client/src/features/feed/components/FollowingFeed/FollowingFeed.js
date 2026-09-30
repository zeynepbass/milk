import { Link } from "react-router-dom";
import { PostList } from "@/features/posts/components/PostList";
import { usePostFeed } from "@/features/posts/hooks/usePostQueries";

export function FollowingFeed() {
  const query = usePostFeed("following");

  return (
    <section aria-label="Takip ettiklerin" className="p-4">
      <PostList
        query={query}
        prioritizeVerified
        emptyTitle="Akışın henüz boş"
        emptyDescription="Üreticileri takip ettiğinde paylaşımları burada görünür."
      />
      {query.isSuccess && (query.data?.pages[0]?.items.length ?? 0) === 0 && (
        <p className="text-center mt-4">
          <Link to="/kesfet" className="text-blue-700 dark:text-yellow-400 font-medium hover:underline">
            Keşfet sayfasına git
          </Link>
        </p>
      )}
    </section>
  );
}
