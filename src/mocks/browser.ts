import { setupWorker } from 'msw/browser';
import { profileHandlers } from '@/features/profile/mocks/handlers';

/**
 * MSW Browser Worker for development
 * This worker will intercept HTTP requests in the browser
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

export const worker = setupWorker(...handlers);
