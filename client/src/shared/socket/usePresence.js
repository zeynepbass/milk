import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/query/queryKeys";

export function usePresence() {
  const { data = [] } = useQuery({
    queryKey: queryKeys.presence,
    queryFn: () => [],
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return new Set(data);
}
