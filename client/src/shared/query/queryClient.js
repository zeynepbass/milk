import { QueryClient } from "@tanstack/react-query";

const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 409, 422]);

const shouldRetry = (failureCount, error) => {
  if (NON_RETRYABLE_STATUSES.has(error?.response?.status)) return false;
  return failureCount < 2;
};

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const queryClient = createQueryClient();
