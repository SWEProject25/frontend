import { setupWorker } from 'msw/browser';
import { profileHandlers } from './handlers';

/**
 * MSW Browser Worker for development
 * This worker will intercept HTTP requests in the browser
 *
 * To use in development:
 * 1. Initialize MSW: npx msw init public/ --save
 * 2. Import and start this worker in your app
 */
export const worker = setupWorker(...profileHandlers);
