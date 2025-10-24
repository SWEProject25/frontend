/**
 * Profile Feature Mock Data
 *
 * This folder contains profile-specific mock data and handlers.
 * The MSW setup files (browser.ts, server.ts, MSWProvider.tsx)
 * have been moved to src/mocks for reusability across features.
 */

// Export MSW handlers (to be used by src/mocks/browser.ts and src/mocks/server.ts)
export * from './handlers';

// Export legacy mock API (if needed for direct usage)
export * from './mockProfileApi';
export * from './mockProfileQueries';
