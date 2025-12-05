import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from '@/mocks/server';

// Import jest-dom matchers
import '@testing-library/jest-dom';

// Set up environment variables for tests
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_API_VERSION = 'v1.0';
process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT = '/';
process.env.NEXT_PUBLIC_AUTH_REGISTER_REDIRECT = '/';

// Mock URL.createObjectURL and URL.revokeObjectURL for file upload tests
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test to ensure test isolation
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Stop MSW server after all tests
afterAll(() => server.close());
