import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { timelineApi } from '../services/timelineAPi';
import {
  AddTweetResponse,
  HashtagSearchDtoResponse,
  ProfileSearchDtoResponse,
  TimelineFeed,
  TimelineFeedDtoResponse,
} from '../types/api';

import toasterMessage from '@/components/ui/home/ToasterMessage';

import {
  useFetchAvatars,
  useNewTweets,
  useSearch,
  useSelectedTab,
} from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import { TIMELINE_ENDPOINTS } from '../constants/api';
import { useAuth } from '@/features/authentication/hooks';
import {
  PROFILE_QUERY_KEYS,
  profileApi,
  ProfileResponseDto,
} from '@/features/profile';
import { useAddPostContext } from '../store/AddPostContext';
import { useOptimisticTweet } from '../optimistics/Tweets';
import { ADD_TWEET } from '../constants/tweetConstants';
import useDebounce from './useDebounce';
export const TIMELINE_QUERY_KEYS = {
  ADD_TWEET: ['tweet'] as const,
  TIMELINE_FEED_FOR_YOU: ['timeline', 'forYou'] as const,
  TIMELINE_FEED_FOR_YOU_POPUP: ['timeline', 'forYou', 'popup'] as const,
  TIMELINE_FEED_FOLLOWING: ['timeline', 'following'] as const,
  TIMELINE_FEED_FOLLOWING_POPUP: ['timeline', 'following', 'popup'] as const,
  PROFILE_SEARCH: (username: string) => ['profile', username] as const,
  HASHTAG_SEARCH: (hashtag: string) => ['hashtag', hashtag] as const,
  VALID_USER: (username: string) => ['mention', username] as const,
};
export const useAddTweet = (label: string) => {
  const selectors = useAddPostContext();

  const { onSuccess, startSending, seterror, clearMedia, clearEmoji } =
    selectors.useActions();
  const queryClient = useQueryClient();
  const user = useAuth().user?.id;
  return useMutation<AddTweetResponse, Error, FormData>({
    mutationFn: async (tweetData) => {
      try {
        const response = await timelineApi.addTweet(tweetData);
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
    onSuccess: async (data) => {
      console.log('app', user, label);

      if (user && label !== ADD_TWEET.REPLY) {
        console.log('quote');
        await queryClient.refetchQueries({
          queryKey: PROFILE_QUERY_KEYS.profilePosts(user),
        });
      }
      if (user && label === ADD_TWEET.REPLY) {
        await queryClient.refetchQueries({
          queryKey: PROFILE_QUERY_KEYS.profileReplies(user),
        });
      }
      if (user) {
        await queryClient.refetchQueries({
          queryKey: PROFILE_QUERY_KEYS.profileMedia(user),
        });
      }
      onSuccess();
      clearMedia();
      clearEmoji();
      const newTweet: TimelineFeed = {
        ...data.data,
        flagReply: label === ADD_TWEET.REPLY,
      };
      toasterMessage(
        'Your post was sent.',
        'bottom-center',
        'success',
        `/home/${newTweet.postId}`
      );

      queryClient.setQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
        TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING,
        (old) => {
          if (!old) return old;

          const updated = {
            ...old,
            pages: old.pages.map((page, ind) => {
              if (ind === 0) {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    posts: [newTweet, ...page.data.posts],
                  },
                };
              }
              return page;
            }),
          };

          return updated;
        }
      );
      queryClient.setQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
        TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
        (old) => {
          if (!old) return old;

          const updated = {
            ...old,
            pages: old.pages.map((page, ind) => {
              if (ind === 0) {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    posts: [newTweet, ...page.data.posts],
                  },
                };
              }
              return page;
            }),
          };

          return updated;
        }
      );
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
    staleTime: Infinity,
  });
};
export const useSearchProfile = (searchUser: string) => {
  return useInfiniteQuery<
    ProfileSearchDtoResponse,
    Error,
    InfiniteData<ProfileSearchDtoResponse, number>,
    ReturnType<typeof TIMELINE_QUERY_KEYS.PROFILE_SEARCH>,
    number
  >({
    queryKey: TIMELINE_QUERY_KEYS.PROFILE_SEARCH(searchUser),
    enabled: searchUser.trim() !== '',
    queryFn: ({ pageParam }) =>
      timelineApi.searchProfile(pageParam, searchUser),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length ? pages.length + 1 : undefined,
  });
};
export const useSearchHashtag = () => {
  const hashtag = useSearch().trimStart();
  const debouncedHashtag = useDebounce(hashtag);

  return useInfiniteQuery<
    HashtagSearchDtoResponse,
    Error,
    InfiniteData<HashtagSearchDtoResponse, number>,
    ReturnType<typeof TIMELINE_QUERY_KEYS.HASHTAG_SEARCH>,
    number
  >({
    enabled: debouncedHashtag.trim() !== '',
    queryKey: TIMELINE_QUERY_KEYS.HASHTAG_SEARCH(debouncedHashtag),
    queryFn: ({ pageParam }) =>
      timelineApi.searchHashtag(pageParam, debouncedHashtag),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
  });
};
export const useCheckValidUser = (username: string) => {
  return useQuery<ProfileResponseDto, Error>({
    queryKey: TIMELINE_QUERY_KEYS.VALID_USER(username),
    queryFn: () => profileApi.getProfileByUsername(username),
    enabled: username.length > 0,
    retry: 1,
  });
};
export const useAvatarsPopUp = () => {
  const selectedTab = useSelectedTab();

  const isPopUpVisible = useFetchAvatars();
  let queryKey,
    queryEndPoint:
      | typeof TIMELINE_ENDPOINTS.TIMELINE_FEED_FLLOWING
      | typeof TIMELINE_ENDPOINTS.TIMELINE_FEED_FOR_YOU;
  if (selectedTab === FOLLOWING_TAB) {
    queryKey = TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING_POPUP;
    queryEndPoint = TIMELINE_ENDPOINTS.TIMELINE_FEED_FLLOWING;
  } else {
    queryKey = TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU_POPUP;
    queryEndPoint = TIMELINE_ENDPOINTS.TIMELINE_FEED_FOR_YOU;
  }
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU_POPUP
    | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING_POPUP,
    number
  >({
    enabled: isPopUpVisible,
    queryKey: queryKey,
    queryFn: ({ pageParam }) =>
      timelineApi.getTimelineFeed(pageParam, queryEndPoint, 3),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => undefined,
    staleTime: 0,
  });
};
