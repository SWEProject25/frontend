'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
interface PollState {
  choices: string[];
  time: number[];
  shiftStartMinutes: number;
  setChoice: (id: number, choice: string) => void;
  setTime: (id: number, timeValue: number) => void;
  reset: () => void;
}
const usePollStore = create<PollState>()(
  devtools((set) => ({
    choices: Array.from({ length: 4 }, () => ''),
    time: [1, 0, 0],
    shiftStartMinutes: 0,
    setChoice: (id, choice) => {
      set((state) => ({
        choices: state.choices.map((ch, ind) => (ind === id - 1 ? choice : ch)),
      }));
    },
    setTime: (id, timeValue) => {
      set((state) => {
        const updatedTime = state.time.map((t, ind) =>
          ind === id - 1 ? timeValue : t
        );
        if (updatedTime.reduce((acc, curr) => acc + curr, 0) === 0) {
          if (id === 1) updatedTime[1] = 1;
          if (id === 2) return { time: updatedTime, shiftStartMinutes: 5 };

          return { time: updatedTime };
        }
        if (updatedTime[0] === 0 && updatedTime[1] === 0) {
          if (updatedTime[2] === 0) updatedTime[2] = 5;
          return { time: updatedTime, shiftStartMinutes: 5 };
        }

        return { time: updatedTime, shiftStartMinutes: 0 };
      });
    },
    reset: () =>
      set({
        time: [1, 0, 0],
        choices: Array.from({ length: 4 }, () => ''),
      }),
  }))
);
export default usePollStore;
