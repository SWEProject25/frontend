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
  // setIsSending: (status: boolean) => void;
  // setIsError: (status: boolean) => void;
  actions: {
    startSending: () => void;
    onSuccess: () => void;
    seterror: (messgae: string) => void;
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
          defaultReplyOption: state.selectedReplyOption,
          selectedReplyOption: 0,
        })),
      seterror: (message) =>
        set({ isSending: false, error: message, isSuccess: false }),
    },
  }))
);

export default useAddTweetStore;
export const useActions = () => useAddTweetStore((state) => state.actions);
