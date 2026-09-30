import { Loading } from "@/shared/components/atoms";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";

export function QueryState({ query, isEmpty, empty, loadingLabel, children }) {
  if (query.isPending) {
    return <Loading label={loadingLabel} />;
  }

  if (query.isError) {
    return <ErrorState description={query.error?.response?.data?.message} onRetry={() => query.refetch()} />;
  }

  if (isEmpty) {
    return empty ?? <EmptyState />;
  }

  return children;
}
