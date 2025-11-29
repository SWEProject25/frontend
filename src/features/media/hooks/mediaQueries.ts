import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { gifApi } from '../services/gifAPi';
import { getQueryClient } from '@/lib/getQueryClient';
import { GifResponse } from '../types/api';
import { useGifsSearch } from '../store/useGif';
import { GIF_ENDPOINTS } from '../constants/api';

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
  const search = useGifsSearch();
  const query = useInfiniteQuery<
    GifResponse,
    Error,
    InfiniteData<GifResponse, number>,
    ReturnType<typeof GIF_QUERY_KEYS.SEARCH_GIF>,
    number
  >({
    queryKey: GIF_QUERY_KEYS.SEARCH_GIF(search),
    queryFn: ({ pageParam }) => gifApi.searchGif(search, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.pagination.count ? pages.length : undefined,
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
