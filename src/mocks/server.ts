import { setupServer } from 'msw/node';
import { profileHandlers } from '@/features/profile/mocks/handlers';
import { authHandlers } from '@/features/authentication/mocks/handlers';
import { timelineHandlers } from '@/features/timeline/mocks/handlers';

/**
 * MSW Server for Node.js (tests)
 * This server will intercept HTTP requests in your test environment
 *
 * Combines handlers from all features
 */
export const handlers = [
  // ...authHandlers,
  // ...profileHandlers,
  ...timelineHandlers,
  // Add handlers from other features here
  // ...tweetHandlers,
  // etc.
];

export const server = setupServer(...handlers);
