'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { defaultQueryOptions } from './config/query';
import AuthInit from './AuthInit';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: defaultQueryOptions,
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
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
