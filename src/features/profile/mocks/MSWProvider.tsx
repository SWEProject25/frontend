'use client';

import { useEffect, useState } from 'react';
import { enableMocking } from './index';

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
        <div className="text-text-secondary">Initializing...</div>
      </div>
    );
  }

  return <>{children}</>;
}
