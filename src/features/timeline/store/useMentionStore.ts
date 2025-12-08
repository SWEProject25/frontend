'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MentionState {
  mention: string;
  isOpen: boolean;
  mentionIsdone: string;
  // setIsSending: (status: boolean) => void;
  // setIsError: (status: boolean) => void;
  actions: {
    setMention: (text: string) => void;
    setIsOpen: (isOpen: boolean) => void;
    setIsDone: (isDone: string) => void;
  };
}

const useMentionStore = create<MentionState>()(
  devtools((set) => ({
    mention: '',
    isOpen: false,
    mentionIsdone: '',
    actions: {
      setMention: (text) => set({ mention: text }),
      setIsOpen: (isOpen) => set({ isOpen: isOpen }),
      setIsDone: (isDone) => set({ mentionIsdone: isDone }),
    },
  }))
);

export default useMentionStore;
export const useActions = () => useMentionStore((state) => state.actions);
export const useMention = () => useMentionStore((state) => state.mention);
export const useMentionIsDone = () =>
  useMentionStore((state) => state.mentionIsdone);
export const useIsOpen = () => useMentionStore((state) => state.isOpen);
