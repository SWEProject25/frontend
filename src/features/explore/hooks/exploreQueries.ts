import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useActions,
  useSearch,
  useSearchDate,
  useSearchExplore,
  useSelectedSearchTab,
  useSelectedTab,
} from '../store/useExploreStore';
import { FOR_YOU_TAB, LATEST_TAB, TOP_TAB } from '../constants/tabs';
import { ExploreSearchFeedDtoResponse } from '../types/api';
import { queries } from '@testing-library/dom';
import { exploreApi } from '../services/exploreApi';
import { EXPLORE_ENDPOINTS } from '../constants/api';
import { TimelineFeedDtoResponse } from '@/features/timeline/types/api';
export const EXPLORE_QUERY_KEYS = {
  EXPLORE_FEED_SEARCH_TOP: (query: string) =>
    ['explore', 'top', query] as const,
  EXPLORE_FEED_SEARCH_LATEST: (query: string) =>
    ['explore', 'latest', query] as const,
  EXPLORE_FEED_FOR_YOU: ['explore', 'forYou'] as const,
};
export const useExploreSearchFeed = () => {
  const selectedTab = useSelectedSearchTab();
  const search = useSearch();
  const searchDate = useSearchDate();
  const isHash =
    search.trimStart().startsWith('#') &&
    !search.trimStart().includes(' ') &&
    !search.trimStart().slice(1).includes('#');
  //   const { setSearchDate } = useActions();
  //   if (selectedTab === LATEST_TAB) setSearchDate(new Date().toISOString());
  const type = isHash ? 'hashtag' : 'searchQuery';
  console.log(isHash);
  const queryKey:
    | ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP>
    | ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST> =
    selectedTab === TOP_TAB || isHash
      ? EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP(search)
      : EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST(search);

  const queryEndPoint = isHash
    ? EXPLORE_ENDPOINTS.EXPLORE_FEED_SEARCH_HASHTAG
    : EXPLORE_ENDPOINTS.EXPLORE_FEED_SEARCH_TWEETS;
  return useInfiniteQuery<
    ExploreSearchFeedDtoResponse,
    Error,
    InfiniteData<ExploreSearchFeedDtoResponse, number>,
    | ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP>
    | ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST>,
    number
  >({
    queryKey: queryKey,
    enabled: search.trim() !== '',
    queryFn: ({ pageParam }) =>
      exploreApi.getSearchFeed(
        pageParam,
        search,
        queryEndPoint,
        type,
        selectedTab,
        searchDate
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
  });
};
export const useExploreFeed = () => {
  const selectedTab = useSelectedTab();
  const queryKey: typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU =
    selectedTab === FOR_YOU_TAB
      ? EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU
      : EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU;

  // const queryEndPoint =
  //   selectedTab === FOR_YOU_TAB
  //     ? EXPLORE_ENDPOINTS.EXPLORE_FEED_FOR_YOU
  //     : EXPLORE_ENDPOINTS.EXPLORE_FEED_FOR_YOU;
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU,
    number
  >({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => exploreApi.getForYouFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
  });
};
