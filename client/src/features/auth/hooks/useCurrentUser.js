import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/query/queryKeys";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";
import { accountService } from "../services/account.service";

export function useCurrentUser() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => accountService.getMe(),
    enabled: status === AUTH_STATUS.authenticated,
    staleTime: 5 * 60 * 1000,
  });
}
