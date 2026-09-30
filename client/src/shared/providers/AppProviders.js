import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@/shared/query/queryClient";
import { SocketProvider } from "@/shared/socket/SocketProvider";

export function AppProviders({ children, client = queryClient }) {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <SocketProvider>{children}</SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
