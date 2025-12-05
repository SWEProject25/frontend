'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { defaultQueryOptions } from './config/query';
import AuthInit from './AuthInit';
import XLoader from '@/components/ui/XLoader';
import { OnboardingFlow } from '@/features/onboarding';
import { NotificationProvider } from '@/features/notifications/components';

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
        <XLoader />
      ) : (
        <>
          {children}
          {/* Onboarding flow - shows modals when user needs to complete onboarding steps */}
          <OnboardingFlow />
          {/* Notification provider - handles real-time Firebase notifications */}
          <NotificationProvider />
        </>
      )}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
