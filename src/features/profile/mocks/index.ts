// Export mock data
export * from './mockData';

// Export MSW handlers
export * from './handlers';

// Export legacy mock API (if needed for direct usage)
export * from './mockProfileApi';
export * from './mockProfileQueries';

// Only export server in Node.js environment (for tests)
// Don't re-export to avoid bundling msw/node in browser
// Use direct imports in test files: import { server } from '@/features/profile/mocks/server'

/**
 * Enable MSW mocking in the browser (for development)
 * Only works in the browser - returns immediately on server
 */
export async function enableMocking() {
  if (typeof window !== 'undefined') {
    // Client-side only: use the browser worker
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    });
  }
  // Server-side: do nothing, MSW is not needed during SSR
}
