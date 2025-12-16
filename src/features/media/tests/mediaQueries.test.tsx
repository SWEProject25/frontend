import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock gifApi - use vi.hoisted for variables used in vi.mock
const { mockGetCategories, mockSearchGif } = vi.hoisted(() => ({
  mockGetCategories: vi.fn(),
  mockSearchGif: vi.fn(),
}));

vi.mock('../services/gifAPi', () => ({
  gifApi: {
    getCategories: () => mockGetCategories(),
    searchGif: (search: string, page: number, limit: number) =>
      mockSearchGif(search, page, limit),
  },
}));

// Mock getQueryClient
const { mockPrefetchQuery } = vi.hoisted(() => ({
  mockPrefetchQuery: vi.fn(),
}));

vi.mock('@/lib/getQueryClient', () => ({
  getQueryClient: vi.fn(() => ({
    prefetchQuery: mockPrefetchQuery,
  })),
}));

// Mock useAddPostContext
const { mockUseGifsSearch } = vi.hoisted(() => ({
  mockUseGifsSearch: vi.fn(),
}));

vi.mock('@/features/timeline/store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useGifsSearch: mockUseGifsSearch,
  })),
}));

import {
  useSearchCategories,
  useSearchGif,
  prefetchSearchCategories,
  GIF_QUERY_KEYS,
} from '../hooks/mediaQueries';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

describe('mediaQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGifsSearch.mockReturnValue('');
  });

  describe('GIF_QUERY_KEYS', () => {
    it('should have correct SEARCH_CATEGORY key', () => {
      expect(GIF_QUERY_KEYS.SEARCH_CATEGORY).toEqual(['category', 'gif']);
    });

    it('should generate correct SEARCH_GIF key', () => {
      expect(GIF_QUERY_KEYS.SEARCH_GIF('test')).toEqual(['gif', 'test']);
    });

    it('should generate different keys for different search terms', () => {
      const key1 = GIF_QUERY_KEYS.SEARCH_GIF('funny');
      const key2 = GIF_QUERY_KEYS.SEARCH_GIF('sad');
      expect(key1).not.toEqual(key2);
    });
  });

  describe('useSearchCategories', () => {
    it('should fetch categories', async () => {
      const mockCategories = [
        { id: '1', title: 'Category 1' },
        { id: '2', title: 'Category 2' },
      ];
      mockGetCategories.mockResolvedValue(mockCategories);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchCategories(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
    });

    it('should handle error', async () => {
      mockGetCategories.mockRejectedValue(new Error('Failed to fetch'));

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchCategories(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('prefetchSearchCategories', () => {
    it('should call prefetchQuery with correct parameters', async () => {
      mockPrefetchQuery.mockResolvedValue(undefined);

      await prefetchSearchCategories();

      expect(mockPrefetchQuery).toHaveBeenCalledWith({
        queryKey: ['category', 'gif'],
        queryFn: expect.any(Function),
      });
    });
  });

  describe('useSearchGif', () => {
    it('should return null values when search is empty', () => {
      mockUseGifsSearch.mockReturnValue('');

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchGif(), { wrapper });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBeNull();
      expect(result.current.isLoading).toBeNull();
      expect(result.current.fetchNextPage).toBeNull();
      expect(result.current.isFetchingNextPage).toBeNull();
      expect(result.current.hasNextPage).toBeNull();
    });

    it('should fetch gifs when search has value', async () => {
      mockUseGifsSearch.mockReturnValue('funny');
      const mockResponse = {
        data: [{ id: '1', title: 'Funny GIF' }],
        pagination: { offset: 0, count: 1, total_count: 10 },
      };
      mockSearchGif.mockResolvedValue(mockResponse);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchGif(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeDefined();
    });

    it('should handle search error', async () => {
      mockUseGifsSearch.mockReturnValue('error-search');
      mockSearchGif.mockRejectedValue(new Error('Search failed'));

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchGif(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should support pagination', async () => {
      mockUseGifsSearch.mockReturnValue('paginated');
      const mockResponse1 = {
        data: [{ id: '1', title: 'GIF 1' }],
        pagination: { offset: 0, count: 1, total_count: 3 },
      };

      mockSearchGif.mockResolvedValue(mockResponse1);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchGif(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('should pass correct parameters to searchGif', async () => {
      mockUseGifsSearch.mockReturnValue('test-query');
      const mockResponse = {
        data: [],
        pagination: { offset: 0, count: 0, total_count: 0 },
      };
      mockSearchGif.mockResolvedValue(mockResponse);

      const wrapper = createWrapper();
      renderHook(() => useSearchGif(), { wrapper });

      await waitFor(() => {
        expect(mockSearchGif).toHaveBeenCalledWith('test-query', 0, 20);
      });
    });
  });
});
