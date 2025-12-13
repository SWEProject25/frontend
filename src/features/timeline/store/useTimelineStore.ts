'use client';
import { create } from 'zustand';
import { FOLLOWING_TAB } from '../constants/menuName';
import { devtools } from 'zustand/middleware';
import { usePathname } from 'next/navigation';
import { useSearchExplore } from '@/features/explore/store/useExploreStore';
import { useActions as useExploreActions } from '@/features/explore/store/useExploreStore';
import { TimelineFeed } from '../types/api';
import { ADD_TWEET } from '../constants/tweetConstants';

interface TimelineState {
  selectedTab: string;
  searchUser: string;
  searchIsOpen: boolean;
  newTweets: TimelineFeed[];
  tabsScroll: number[];
  fetchAvatars: boolean;
  parentId: number;
  postType: string;
  popUpAvatars: { avatar: string | null; name: string }[];

  visibleTweets: TimelineFeed[];
  actions: {
    selectTab: (value: string) => void;
    setSearchUser: (user: string) => void;
    setNewTweets: (tweets: TimelineFeed[]) => void;
    setSearchIsOpen: (isOpen: boolean) => void;
    setPopUpAvatars: (
      avatars: { avatar: string | null; name: string }[]
    ) => void;
    setFetchAvatars: (fetch: boolean) => void;
    setTabsScroll: (scroll: number[]) => void;
    setParentId: (id: number) => void;
    setPostType: (type: string) => void;
    addVisibleTweet: (tweet: TimelineFeed) => void;
    removeVisibleTweet: (tweet: TimelineFeed) => void;
  };
}
const useTimelineStore = create<TimelineState>()(
  devtools((set) => ({
    selectedTab: FOLLOWING_TAB,
    searchUser: '',
    searchIsOpen: false,
    newTweets: [],
    popUpAvatars: [],
    fetchAvatars: false,
    tabsScroll: [0, 0],
    parentId: -1,
    postType: ADD_TWEET.POST,
    visibleTweets: [],
    actions: {
      selectTab: (value) => set({ selectedTab: value }),
      setSearchUser: (user) => set({ searchUser: user }),
      setNewTweets: (tweets) => set({ newTweets: tweets }),
      setSearchIsOpen: (isOpen) => set({ searchIsOpen: isOpen }),
      setPopUpAvatars: (avatars) => set({ popUpAvatars: [...avatars] }),
      setFetchAvatars: (fetch) => set({ fetchAvatars: fetch }),
      setTabsScroll: (scroll) => set({ tabsScroll: scroll }),
      setParentId: (id) => set({ parentId: id }),
      setPostType: (type) => set({ postType: type }),
      addVisibleTweet: (tweet) =>
        set((state) => ({
          visibleTweets: [...state.visibleTweets, tweet],
        })),

      // removeVisibleTweet: (tweet) =>
      //   set((state) => {
      //     const newTweets = state.visibleTweets.filter(
      //       (t) => t.postId === tweet.postId
      //     );

      //     return { visibleTweets: newTweets };
      //   }),
      removeVisibleTweet: (tweet) =>
        set((state) => {
          const newTweets = state.visibleTweets.filter((t) => {
            if (t.isRepost && t.originalPostData && tweet.originalPostData) {
              return (
                t.originalPostData.postId === tweet.originalPostData?.postId &&
                t.userId === tweet.userId
              );
            }
            return t.postId === tweet.postId;
          });

          return { visibleTweets: newTweets };
        }),
    },
  }))
);

export const useSelectedTab = () =>
  useTimelineStore((state) => state.selectedTab);
export const useActions = () => useTimelineStore((state) => state.actions);
export const useSearchUser = () =>
  useTimelineStore((state) => state.searchUser);

export const useSearch = () => {
  const route = usePathname();
  const searchUser = useSearchUser();
  const searchExplore = useSearchExplore();
  return route === '/home' ? searchUser : searchExplore;
};
export const useSearchAction = () => {
  const route = usePathname();
  const { setSearchUser, setSearchIsOpen } = useActions();
  const { setSearchQuery: setSearchExplore } = useExploreActions();
  return {
    setSearch: route === '/home' ? setSearchUser : setSearchExplore,
    setIsOpen: setSearchIsOpen,
  };
};
export const useSearchIsopen = () =>
  useTimelineStore((state) => state.searchIsOpen);
export const useNewTweets = () => useTimelineStore((state) => state.newTweets);

export const usePopUpAvatars = () =>
  useTimelineStore((state) => state.popUpAvatars);

export const useFetchAvatars = () =>
  useTimelineStore((state) => state.fetchAvatars);
export const useTabsScroll = () =>
  useTimelineStore((state) => state.tabsScroll);
export const useParentId = () => useTimelineStore((state) => state.parentId);
export const usePostType = () => useTimelineStore((state) => state.postType);
