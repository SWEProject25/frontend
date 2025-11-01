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
export const TIMELINE_QUERY_KEYS = {
  ADD_TWEET: ['tweet'] as const,
  TIMELINE_FEED_FOR_YOU: ['timelie-forYou'] as const,
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

export const useFeedForYou = () => {
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
    number
  >({
    queryKey: TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
    queryFn: ({ pageParam }) => timelineApi.getForYouTweets(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
  });
};
