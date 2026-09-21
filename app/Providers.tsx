"use client"
import { useRef } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/stores/root-store';

/**
 * Security: purges the entire TanStack Query cache whenever the session
 * identity changes (sign-in or sign-out). Without this, cached case/lab/opinion
 * data (PHI) from one account remains in memory and can be rendered for the
 * next user on a shared browser. Rendered inside QueryClientProvider.
 */
function SessionCacheReset() {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const prevStatus = useRef(status);

  useEffect(() => {
    if (prevStatus.current !== status) {
      prevStatus.current = status;
      void queryClient.cancelQueries();
      queryClient.clear();
    }
  }, [status, queryClient]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,  // 5 minutes
        gcTime: 10 * 60 * 1000,    // 10 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  // Rehydrate the persisted booking-wizard store after mount (client-only),
  // so server-rendered HTML and hydrated state can never diverge.
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SessionCacheReset />
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}
