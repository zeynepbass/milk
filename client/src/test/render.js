import { render } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createQueryClient } from "@/shared/query/queryClient";
import { queryKeys } from "@/shared/query/queryKeys";
import { useAuthStore } from "@/shared/store/useAuthStore";

export const signIn = (user) => {
  useAuthStore.setState({ status: "authenticated", accessToken: "test-token", userId: user._id });
};

export function renderWithProviders(ui, { route = "/test", path = "/test", user, queryClient = createQueryClient() } = {}) {
  if (user) {
    signIn(user);
    queryClient.setQueryData(queryKeys.me, user);
  }

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          <Route path="/" element={<p>Ana sayfa</p>} />
          <Route path="/mesajlar" element={<p>Mesajlar sayfası</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return { ...result, queryClient };
}
