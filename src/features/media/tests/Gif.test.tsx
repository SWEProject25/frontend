import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

// Mock getQueryClient
vi.mock('@/lib/getQueryClient', () => ({
  getQueryClient: vi.fn(() => ({
    prefetchQuery: vi.fn(),
  })),
}));

// Mock tanstack query
vi.mock('@tanstack/react-query', () => ({
  dehydrate: vi.fn((client) => ({ state: 'dehydrated', client })),
  HydrationBoundary: function MockHydrationBoundary({
    children,
    state,
  }: {
    children: React.ReactNode;
    state: unknown;
  }) {
    return (
      <div data-testid="hydration-boundary" data-state={JSON.stringify(state)}>
        {children}
      </div>
    );
  },
}));

// Mock GifModal
vi.mock('../components/GifModal', () => ({
  default: function MockGifModal() {
    return <div data-testid="gif-modal">GifModal</div>;
  },
}));

// Mock gifApi
vi.mock('../services/gifAPi', () => ({
  gifApi: {
    getCategories: vi.fn(),
  },
}));

// Mock mediaQueries
vi.mock('../hooks/mediaQueries', () => ({
  prefetchSearchCategories: vi.fn().mockResolvedValue(undefined),
}));

// We test Gif as a module since it's an async component
describe('Gif Component', () => {
  it('should export default function', async () => {
    const gifModule = await import('../components/Gif');
    expect(gifModule.default).toBeDefined();
    expect(typeof gifModule.default).toBe('function');
  });

  it('should be an async component', async () => {
    const gifModule = await import('../components/Gif');
    const result = gifModule.default();
    expect(result).toBeInstanceOf(Promise);
  });
});
