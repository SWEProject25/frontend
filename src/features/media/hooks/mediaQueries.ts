import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { gifApi } from '../services/gifAPi';
import { getQueryClient } from '@/lib/getQueryClient';
import { GifResponse } from '../types/api';

import { useAddPostContext } from '@/features/timeline/store/AddPostContext';

export const GIF_QUERY_KEYS = {
  SEARCH_CATEGORY: ['category', 'gif'] as const,
  SEARCH_GIF: (text: string) => ['gif', text] as const,
};
export const useSearchCategories = () => {
  return useQuery({
    queryKey: GIF_QUERY_KEYS.SEARCH_CATEGORY,
    queryFn: gifApi.getCategories,
  });
};

export const prefetchSearchCategories = () => {
  const queryClient = getQueryClient();
  return queryClient.prefetchQuery({
    queryKey: GIF_QUERY_KEYS.SEARCH_CATEGORY,
    queryFn: gifApi.getCategories,
  });
};

export const useSearchGif = () => {
  const selectors = useAddPostContext();

  const search = selectors.useGifsSearch();
  const query = useInfiniteQuery<
    GifResponse,
    Error,
    InfiniteData<GifResponse, number>,
    ReturnType<typeof GIF_QUERY_KEYS.SEARCH_GIF>,
    number
  >({
    queryKey: GIF_QUERY_KEYS.SEARCH_GIF(search),
    queryFn: ({ pageParam }) => {
      return gifApi.searchGif(search, pageParam, 20);
    },
    initialPageParam: 0,
    enabled: !!search,
    getNextPageParam: (lastPage, pages) => {
      const { offset, count, total_count } = lastPage.pagination;

      // Check if there are more results to fetch
      const hasMore = offset + count < total_count;
      const nextPage = hasMore ? pages.length : undefined;
      return nextPage;
    },
  });
  if (!search)
    return {
      data: null,
      error: null,
      isError: null,
      isLoading: null,
      fetchNextPage: null,
      isFetchingNextPage: null,
      hasNextPage: null,
    };
  return query;
};
