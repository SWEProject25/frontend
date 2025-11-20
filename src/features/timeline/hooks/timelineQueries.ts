import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { timelineApi } from '../services/timelineAPi';
import {
  AddTweetResponse,
  TimelineFeed,
  TimelineFeedDtoResponse,
} from '../types/api';
import { useActions } from '../store/useAddTweetStore';

import toasterMessage from '@/components/ui/home/ToasterMessage';
import { useMediaActions } from '@/features/media/store/useMedia';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import { TIMELINE_ENDPOINTS } from '../constants/api';
import { useAuth } from '@/features/authentication/hooks';
export const TIMELINE_QUERY_KEYS = {
  ADD_TWEET: ['tweet'] as const,
  TIMELINE_FEED_FOR_YOU: ['timeline', 'forYou'] as const,
  TIMELINE_FEED_FOLLOWING: ['timeline', 'following'] as const,
};
export const useAddTweet = () => {
  const { onSuccess, startSending, seterror } = useActions();
  const queryClient = useQueryClient();
  const { clearMedia } = useMediaActions();
  const user = useAuth().user;
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
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: [''] });
      onSuccess();
      clearMedia();
      toasterMessage('Your post was sent.');
      console.log(data);

      // const newTweet: TimelineFeed = {
      //   userId: 40,
      //   username: 'albaz.mo867',
      //   verified: true,
      //   name: 'Yousef Adel',
      //   avatar: null,
      //   postId: 50,
      //   date: '2025-11-20T22:4:59.850Z',
      //   likesCount: 3,
      //   retweetsCount: 2,
      //   commentsCount: 47,
      //   isLikedByMe: false,
      //   isFollowedByMe: true,
      //   isRepostedByMe: false,
      //   text: 'test new add2',
      //   media: [],
      //   isRepost: true,
      //   isQuote: false,
      //   originalPostData: undefined,
      // };
      //       queryClient.batch(() => {
      //         queryClient.setQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
      //           TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING,
      //           (old) => {
      //             console.log('Old data:', old);
      //             if (!old) return old;

      //             const updated = {
      //               ...old,
      //               pages: old.pages.map((page, ind) => {
      //                 if (ind === 0) {
      //                   return {
      //                     ...page,
      //                     data: {
      //                       ...page.data,
      //                       posts: [newTweet, ...page.data.posts],
      //                     },
      //                   };
      //                 }
      //                 return page;
      //               }),
      //             };

      //             console.log('Updated data:', updated);
      //             return updated;
      //           }
      //         );
      //         queryClient.setQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
      //           TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
      //           (old) => {
      //             console.log('Old data:', old);
      //             if (!old) return old;

      //             const updated = {
      //               ...old,
      //               pages: old.pages.map((page, ind) => {
      //                 if (ind === 0) {
      //                   return {
      //                     ...page,
      //                     data: {
      //                       ...page.data,
      //                       posts: [newTweet, ...page.data.posts],
      //                     },
      //                   };
      //                 }
      //                 return page;
      //               }),
      //             };

      //             console.log('Updated data:', updated);
      //             return updated;
      //           }
      //         );
      //       });
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
