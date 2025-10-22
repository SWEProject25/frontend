import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// runs a cleanup after each test case
afterEach(() => {
  cleanup();
});
