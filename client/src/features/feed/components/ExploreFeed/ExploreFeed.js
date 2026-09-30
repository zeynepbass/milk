import { useSearchStore } from "@/shared/store/useSearchStore";
import { PostList } from "@/features/posts/components/PostList";
import { usePostFeed } from "@/features/posts/hooks/usePostQueries";

export function ExploreFeed() {
  const search = useSearchStore((state) => state.search);
  const query = usePostFeed("explore", { search });

  return (
    <section aria-label="Keşfet" className="p-4">
      <PostList
        query={query}
        prioritizeVerified
        emptyTitle={search ? "Sonuç bulunamadı" : "Gönderi Bulunamadı"}
        emptyDescription={search ? `"${search}" için eşleşen gönderi yok.` : "Henüz paylaşılmış bir gönderi yok."}
      />
    </section>
  );
}
