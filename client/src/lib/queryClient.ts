import { QueryClient } from "@tanstack/react-query";

// Pure frontend - no API calls needed for landing page

// Pure frontend QueryClient - no API calls needed for static landing page
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // No refetching needed for static content
      retry: 0, // No retries needed
    },
    mutations: {
      retry: 0,
    },
  },
});
