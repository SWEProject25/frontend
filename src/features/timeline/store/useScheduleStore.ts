import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ScheduleState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
const useScheduleStore = create<ScheduleState>()(
  devtools((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }))
);

export default useScheduleStore;
