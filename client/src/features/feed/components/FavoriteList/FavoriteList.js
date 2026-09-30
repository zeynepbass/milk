import { PostList } from "@/features/posts/components/PostList";
import { usePostFeed } from "@/features/posts/hooks/usePostQueries";

export function FavoriteList() {
  const query = usePostFeed("saved");

  return (
    <section aria-label="Kaydedilenler" className="p-4">
      <PostList
        query={query}
        emptyTitle="Kaydedilen gönderi yok"
        emptyDescription="Beğendiğin ürünleri kaydederek burada toplayabilirsin."
      />
    </section>
  );
}
