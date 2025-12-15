'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { defaultQueryOptions } from './config/query';
import AuthInit from './AuthInit';
import XLoader from '@/components/ui/XLoader';
import { OnboardingFlow } from '@/features/onboarding';
import { NotificationProvider } from '@/features/notifications/components';
import { initSocket } from '@/features/messages/services/socket';

function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(function () {
    const socket = initSocket();
    if (socket) console.log('Socket initialized at app level');
  }, []);
  return <>{children}</>;
}
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
        <SocketProvider>
          {children}
          {/* Onboarding flow - shows modals when user needs to complete onboarding steps */}
          <OnboardingFlow />
          {/* Notification provider - handles real-time Firebase notifications */}
          <NotificationProvider />
        </SocketProvider>
      )}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
