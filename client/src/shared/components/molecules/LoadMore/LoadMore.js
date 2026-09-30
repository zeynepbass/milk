import { Button } from "@/shared/components/atoms";

export function LoadMore({ query, label = "Daha fazla göster" }) {
  if (!query.hasNextPage) return null;

  return (
    <div className="flex justify-center py-6">
      <Button
        type="button"
        variant="primary"
        onClick={() => query.fetchNextPage()}
        loading={query.isFetchingNextPage}
        loadingText="Yükleniyor..."
      >
        {label}
      </Button>
    </div>
  );
}
