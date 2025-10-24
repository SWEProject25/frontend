/**
 * Shared MSW Setup
 *
 * This folder contains the centralized MSW configuration
 * that combines handlers from all features.
 *
 * Structure:
 * - browser.ts - Browser worker for development
 * - server.ts - Node server for tests
 * - MSWProvider.tsx - React provider component
 *
 * Usage in tests:
 * Import { server } from '@/mocks/server'
 *
 * Usage in app:
 * MSWProvider is already wrapped in root layout
 */

export * from './MSWProvider';
export * from './mockData';

// Don't export server/browser directly to avoid bundling issues
// Import them directly when needed:
// import { server } from '@/mocks/server' (tests only)
// import { worker } from '@/mocks/browser' (manual use only)
