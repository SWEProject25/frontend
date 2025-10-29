'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import AuthInit from './AuthInit';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error) => {
              // Don't retry on 401/403 errors
              if (error && typeof error === 'object' && 'statusCode' in error) {
                const statusCode = (error as { statusCode: number }).statusCode;
                if (statusCode === 401 || statusCode === 403) {
                  return false;
                }
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );
  const [authResolved, setAuthResolved] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {/* authResolved guards rendering until we know auth status to avoid layout flashes */}
      <AuthInit onReady={() => setAuthResolved(true)} />
      {!authResolved ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <span className="text-gray-400">Loading...</span>
          </div>
        </div>
      ) : (
        children
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
