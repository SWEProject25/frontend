import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  useSearch,
  useSearchDate,
  useSelectedInterestTab,
  useSelectedSearchTab,
  useSelectedTab,
} from '../store/useExploreStore';
import {
  ENTERTAINMENT_TAB,
  FOR_YOU_TAB,
  NEWS_TAB,
  SPORTS_TAB,
  TOP_TAB,
  TRENDING_TAB,
} from '../constants/tabs';
import {
  ExplorePersonalizedFeedDtoResponse,
  ExploreSearchFeedDtoResponse,
  ExploreTrendingFeedDtoResponse,
} from '../types/api';
import { exploreApi } from '../services/exploreApi';
import { EXPLORE_ENDPOINTS } from '../constants/api';
import { TimelineFeedDtoResponse } from '@/features/timeline/types/api';
import { usePathname } from 'next/navigation';
export const EXPLORE_QUERY_KEYS = {
  EXPLORE_FEED_SEARCH_TOP: (query: string) =>
    ['explore', 'top', query] as const,
  EXPLORE_FEED_SEARCH_LATEST: (query: string) =>
    ['explore', 'latest', query] as const,
  EXPLORE_FEED_FOR_YOU: ['explore', 'forYou'] as const,
  EXPLORE_FEED_INTEREST: (interest: string, tab: string) =>
    ['explore', 'interest', interest, tab] as const,
  EXPLORE_TRENDS_FOR_YOU: ['explore', 'trends', 'forYou'] as const,
  EXPLORE_TRENDS_TRENDING: ['explore', 'trends', 'trending'] as const,
  EXPLORE_TRENDS_SPORTS: ['explore', 'trends', 'sports'] as const,
  EXPLORE_TRENDS_NEWS: ['explore', 'trends', 'news'] as const,
  EXPLORE_TRENDS_ENTERTAINMENT: ['explore', 'trends', 'entertainment'] as const,
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

export const useExplorePosts = () => {
  const selectedTab = useSelectedTab();
  const queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU;
  const postsPerInterest = 5;
  return useQuery<
    ExplorePersonalizedFeedDtoResponse,
    Error,
    ExplorePersonalizedFeedDtoResponse,
    typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU
  >({
    enabled: selectedTab === FOR_YOU_TAB,
    queryKey: queryKey,
    queryFn: () => exploreApi.getForYouFeed(postsPerInterest),
  });
};

export const useTrendingFeed = () => {
  const selectedTab = useSelectedTab();
  const path = usePathname();
  const valid = path?.startsWith('/explore');
  console.log(path, valid);
  let queryKey;
  let limit;
  switch (selectedTab) {
    case TRENDING_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_TRENDING;
      limit = 30;
      break;

    case SPORTS_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_SPORTS;
      limit = 30;
      break;
    case NEWS_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_NEWS;
      limit = 30;
      break;

    case ENTERTAINMENT_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_ENTERTAINMENT;
      limit = 30;
      break;
    case FOR_YOU_TAB:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_FOR_YOU;
      limit = 5;
    default:
      queryKey = EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_FOR_YOU;
      limit = 5;
  }

  return useQuery<
    ExploreTrendingFeedDtoResponse,
    Error,
    ExploreTrendingFeedDtoResponse,
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_FOR_YOU
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_NEWS
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_SPORTS
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_TRENDING
    | typeof EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_ENTERTAINMENT
  >({
    enabled: valid,
    queryKey: queryKey,
    queryFn: () => exploreApi.getTrendingFeed(selectedTab, limit),
  });
};
export const useExploreInterest = (interest: string) => {
  const tab = useSelectedInterestTab();
  const queryKey = EXPLORE_QUERY_KEYS.EXPLORE_FEED_INTEREST(interest, tab);
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_INTEREST>,
    number
  >({
    enabled: interest.trim() !== '',
    queryKey: queryKey,
    queryFn: ({ pageParam }) =>
      exploreApi.getInterestFeed(pageParam, interest, tab),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
  });
};
