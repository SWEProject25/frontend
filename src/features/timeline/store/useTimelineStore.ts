import { create } from 'zustand';
import { FOLLOWING_TAB } from '../constants/menuName';
import { devtools } from 'zustand/middleware';

interface TimelineState {
  selectedTab: string;
  actions: {
    selectTab: (value: string) => void;
  };
}
const useTimelineStore = create<TimelineState>()(
  devtools((set) => ({
    selectedTab: FOLLOWING_TAB,
    actions: {
      selectTab: (value) => set({ selectedTab: value }),
    },
  }))
);

export const useSelectedTab = () =>
  useTimelineStore((state) => state.selectedTab);
export const useActions = () => useTimelineStore((state) => state.actions);
