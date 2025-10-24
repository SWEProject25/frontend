import { setupServer } from 'msw/node';
import { profileHandlers } from './handlers';

/**
 * MSW Server for Node.js (tests)
 * This server will intercept HTTP requests in your test environment
 */
export const server = setupServer(...profileHandlers);
