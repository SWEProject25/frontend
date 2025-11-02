import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { timelineApi } from '../services/timelineAPi';
import { AddTweetResponse, TimelineFeedDtoResponse } from '../types/api';
import { useActions } from '../store/useAddTweetStore';

import toasterMessage from '@/components/ui/home/ToasterMessage';
import { useMediaActions } from '@/features/media/store/useMedia';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import { TIMELINE_ENDPOINTS } from '../constants/api';
export const TIMELINE_QUERY_KEYS = {
  ADD_TWEET: ['tweet'] as const,
  TIMELINE_FEED_FOR_YOU: ['timeline', 'forYou'] as const,
  TIMELINE_FEED_FOLLOWING: ['timeline', 'following'] as const,
};
export const useAddTweet = () => {
  const { onSuccess, startSending, seterror } = useActions();
  const queryClient = useQueryClient();
  const { clearMedia } = useMediaActions();
  console.log('inside useAddTweet');
  return useMutation<AddTweetResponse, Error, FormData>({
    mutationFn: async (tweetData) => {
      try {
        const response = await timelineApi.addTweet(tweetData);
        console.log(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create post';
        seterror(errorMessage);
        toasterMessage(
          ` somthing wnet wrong, but don't fret —— let's give it another shot.` +
            ' —— Error message : ' +
            errorMessage,
          'top-center',
          'error'
        );
        throw error;
      }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [''] });
      onSuccess();
      clearMedia();
      toasterMessage('Your post was sent.');
    },
    networkMode: 'always',
    onMutate: () => {
      startSending();
    },
  });
};

export const useTimelineFeed = () => {
  const selectedTab = useSelectedTab();
  let queryKey,
    queryEndPoint:
      | typeof TIMELINE_ENDPOINTS.TIMELINE_FEED_FLLOWING
      | typeof TIMELINE_ENDPOINTS.TIMELINE_FEED_FOR_YOU;
  if (selectedTab === FOLLOWING_TAB) {
    queryKey = TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING;
    queryEndPoint = TIMELINE_ENDPOINTS.TIMELINE_FEED_FLLOWING;
  } else {
    queryKey = TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU;
    queryEndPoint = TIMELINE_ENDPOINTS.TIMELINE_FEED_FOR_YOU;
  }
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
    | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING,
    number
  >({
    queryKey: queryKey,
    queryFn: ({ pageParam }) =>
      timelineApi.getTimelineFeed(pageParam, queryEndPoint),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
  });
};
