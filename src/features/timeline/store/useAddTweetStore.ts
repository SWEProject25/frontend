'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AddTweetState {
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  defaultReplyOption: number;
  selectedReplyOption: number;
  updateReplyOption: (id?: number) => void;
  tweetText: string;
  setTweetText: (text: string) => void;
  isSending: boolean;
  error: string;
  isSuccess: boolean;
  mention: string;
  // setIsSending: (status: boolean) => void;
  // setIsError: (status: boolean) => void;
  actions: {
    startSending: () => void;
    onSuccess: () => void;
    seterror: (messgae: string) => void;
    setMention: (text: string) => void;
  };
}

const useAddTweetStore = create<AddTweetState>()(
  devtools((set) => ({
    defaultReplyOption: 1,
    scheduledTime: '',
    setScheduledTime: (time) => set({ scheduledTime: time }),
    selectedReplyOption: 0,
    updateReplyOption: (id) =>
      set((state) => ({ selectedReplyOption: id ?? state.defaultReplyOption })),
    tweetText: '',
    setTweetText: (text) => set({ tweetText: text }),
    isSending: false,
    error: '',
    isSuccess: false,
    mention: '',
    // setIsSending: (status) => set({ isSending: status }),
    // setIsError: (status) => set({ isError: status }),
    actions: {
      startSending: () => set({ isSending: true, error: '', isSuccess: false }),
      onSuccess: () =>
        set((state) => ({
          isSending: false,
          isSuccess: true,
          error: '',
          tweetText: '',
          mentoin: '',
          defaultReplyOption: state.selectedReplyOption,
          selectedReplyOption: 0,
        })),
      seterror: (message) =>
        set({ isSending: false, error: message, isSuccess: false }),
      setMention: (text) => set((state) => ({ mention: state.mention + text })),
    },
  }))
);

export default useAddTweetStore;
export const useActions = () => useAddTweetStore((state) => state.actions);
export const useMention = () => useAddTweetStore((state) => state.mention);
