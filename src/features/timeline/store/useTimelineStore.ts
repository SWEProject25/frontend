'use client';
import { create } from 'zustand';
import { FOLLOWING_TAB } from '../constants/menuName';
import { devtools } from 'zustand/middleware';
import { usePathname } from 'next/navigation';
import { useSearchExplore } from '@/features/explore/store/useExploreStore';
import { useActions as useExploreActions } from '@/features/explore/store/useExploreStore';
import { TimelineFeed } from '../types/api';

interface TimelineState {
  selectedTab: string;
  searchUser: string;
  newTweets: TimelineFeed[];
  actions: {
    selectTab: (value: string) => void;
    setSearchUser: (user: string) => void;
    setNewTweets: (tweets: TimelineFeed[]) => void;
  };
}
const useTimelineStore = create<TimelineState>()(
  devtools((set) => ({
    selectedTab: FOLLOWING_TAB,
    searchUser: '',
    newTweets: [],
    actions: {
      selectTab: (value) => set({ selectedTab: value }),
      setSearchUser: (user) => set({ searchUser: user }),
      setNewTweets: (tweets) => set({ newTweets: tweets }),
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
  const { setSearchUser } = useActions();
  const { setSearchQuery: setSearchExplore } = useExploreActions();
  return route === '/home' ? setSearchUser : setSearchExplore;
};

export const useNewTweets = () => useTimelineStore((state) => state.newTweets);
