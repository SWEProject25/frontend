'use client';

import { useEffect, useState } from 'react';

/**
 * MSW Provider Component
 * Initializes MSW in the browser before rendering children
 * Only runs in development mode
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isMSWReady, setIsMSWReady] = useState(
    () => process.env.NODE_ENV !== 'development'
  );

  useEffect(() => {
    // Only enable MSW in development
    if (process.env.NODE_ENV === 'development') {
      async function enableMocking() {
        if (typeof window !== 'undefined') {
          // Client-side only: use the browser worker
          const { worker } = await import('./browser');
          await worker.start({
            onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
          });
        }
      }

      enableMocking()
        .then(() => {
          console.log('[MSW] Mocking enabled');
          setIsMSWReady(true);
        })
        .catch((error) => {
          console.error('[MSW] Failed to start:', error);
          setIsMSWReady(true); // Render anyway even if MSW fails
        });
    }
  }, []);

  if (!isMSWReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Initializing MSW...</div>
      </div>
    );
  }

  return <>{children}</>;
}
