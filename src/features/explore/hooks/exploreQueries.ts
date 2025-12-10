import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
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
import {
  ENTERTAINMENT_TAB,
  FOR_YOU_TAB,
  LATEST_TAB,
  NEWS_TAB,
  SPORTS_TAB,
  TOP_TAB,
  TRENDING_TAB,
} from '../constants/tabs';
import {
  ExploreSearchFeedDtoResponse,
  ExploreTrendingFeedDtoResponse,
} from '../types/api';
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
  EXPLORE_FEED_TRENDING: ['explore', 'trending'] as const,
  EXPLORE_FEED_SPORTS: ['explore', 'sports'] as const,
  EXPLORE_FEED_NEWS: ['explore', 'news'] as const,
  EXPLORE_FEED_ENTERTAINMENT: ['explore', 'entertainment'] as const,
};
export const useExploreSearchFeed = () => {
  const selectedTab = useSelectedSearchTab();
  const search = useSearch();
  console.log(search.length);
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
    selectedTab === TOP_TAB
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
  const postsFeed = useExplorePosts();
  const trendingFeed = useTrendingFeed();

  if (selectedTab !== FOR_YOU_TAB) {
    return trendingFeed;
  } else {
    return postsFeed;
  }
};

export const useExplorePosts = () => {
  const selectedTab = useSelectedTab();
  const queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU;
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
    enabled: selectedTab === FOR_YOU_TAB,
    queryKey: queryKey,
    queryFn: ({ pageParam }) => exploreApi.getForYouFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
  });
};

export const useTrendingFeed = () => {
  const selectedTab = useSelectedTab();
  let queryKey;
  let limit;
  switch (selectedTab) {
    case TRENDING_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_TRENDING;
      limit = 30;
      break;

    case SPORTS_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_SPORTS;
      limit = 30;
      break;
    case NEWS_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_NEWS;
      limit = 30;
      break;

    case ENTERTAINMENT_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_ENTERTAINMENT;
      limit = 30;
      break;
    default:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_TRENDING;
      limit = 5;
  }

  return useQuery<
    ExploreTrendingFeedDtoResponse,
    Error,
    ExploreTrendingFeedDtoResponse,
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_ENTERTAINMENT
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_SPORTS
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_TRENDING
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_NEWS
  >({
    enabled: selectedTab !== FOR_YOU_TAB,
    queryKey: queryKey,
    queryFn: () => exploreApi.getTrendingFeed(selectedTab, limit),
  });
};
