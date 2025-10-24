import { setupServer } from 'msw/node';
import { profileHandlers } from '@/features/profile/mocks/handlers';

/**
 * MSW Server for Node.js (tests)
 * This server will intercept HTTP requests in your test environment
 *
 * Combines handlers from all features
 */
export const handlers = [
  ...profileHandlers,
  // Add handlers from other features here
  // ...authHandlers,
  // ...tweetHandlers,
  // etc.
];

export const server = setupServer(...handlers);
