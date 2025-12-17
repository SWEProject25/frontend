import { create } from 'zustand';
import { FOR_YOU_TAB, TOP_TAB } from '../constants/tabs';
import { devtools } from 'zustand/middleware';

interface ExploreState {
  selectedTab: string;
  selectedSearchTab: string;
  selectedInterestTab: string;
  search: string;
  interest: string;
  searchQuery: string;
  searchDate: string;
  actions: {
    selectTab: (value: string) => void;
    selectInterestTab: (value: string) => void;

    selectSearchTab: (value: string) => void;
    setSearch: (text: string) => void;
    setInterest: (text: string) => void;
    setSearchQuery: (text: string) => void;
    setSearchDate: (date: string) => void;
  };
}
const useExploreStore = create<ExploreState>()(
  devtools((set) => ({
    selectedTab: FOR_YOU_TAB,
    selectedSearchTab: TOP_TAB,
    search: '',
    interest: '',
    searchQuery: '',
    selectedInterestTab: TOP_TAB,

    actions: {
      selectTab: (value) => set({ selectedTab: value }),
      selectInterestTab: (value) => set({ selectedInterestTab: value }),
      selectSearchTab: (value) => set({ selectedSearchTab: value }),
      setSearch: (text) => set({ search: text }),
      setInterest: (text) => set({ interest: text }),
      setSearchQuery: (text) => set({ searchQuery: text }),
      setSearchDate: (date) => set({ searchDate: date }),
    },
  }))
);

export const useSelectedTab = () =>
  useExploreStore((state) => state.selectedTab);
export const useSelectedInterestTab = () =>
  useExploreStore((state) => state.selectedInterestTab);
export const useSelectedSearchTab = () =>
  useExploreStore((state) => state.selectedSearchTab);
export const useActions = () => useExploreStore((state) => state.actions);
export const useInterest = () => useExploreStore((state) => state.interest);
export const useSearch = () => useExploreStore((state) => state.search);
export const useSearchExplore = () =>
  useExploreStore((state) => state.searchQuery);
export const useSearchDate = () => useExploreStore((state) => state.searchDate);
