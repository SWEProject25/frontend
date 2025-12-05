import { create } from 'zustand';
import { FOR_YOU_TAB, TOP_TAB } from '../constants/tabs';
import { devtools } from 'zustand/middleware';

interface ExploreState {
  selectedTab: string;
  selectedSearchTab: string;
  search: string;
  searchQuery: string;
  searchDate: string;
  actions: {
    selectTab: (value: string) => void;
    selectSearchTab: (value: string) => void;
    setSearch: (text: string) => void;
    setSearchQuery: (text: string) => void;
    setSearchDate: (date: string) => void;
  };
}
const useExploreStore = create<ExploreState>()(
  devtools((set) => ({
    selectedTab: FOR_YOU_TAB,
    selectedSearchTab: TOP_TAB,
    search: '',
    searchQuery: '',

    actions: {
      selectTab: (value) => set({ selectedTab: value }),
      selectSearchTab: (value) => set({ selectedSearchTab: value }),
      setSearch: (text) => set({ search: text }),
      setSearchQuery: (text) => set({ searchQuery: text }),
      setSearchDate: (date) => set({ searchDate: date }),
    },
  }))
);

export const useSelectedTab = () =>
  useExploreStore((state) => state.selectedTab);
export const useSelectedSearchTab = () =>
  useExploreStore((state) => state.selectedSearchTab);
export const useActions = () => useExploreStore((state) => state.actions);
export const useSearch = () => useExploreStore((state) => state.search);
export const useSearchExplore = () =>
  useExploreStore((state) => state.searchQuery);
export const useSearchDate = () => useExploreStore((state) => state.searchDate);
