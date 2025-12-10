'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mentionType } from '../components/TweetText';

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
  mentions: mentionType[];
  // setIsSending: (status: boolean) => void;
  // setIsError: (status: boolean) => void;
  actions: {
    startSending: () => void;
    onSuccess: () => void;
    seterror: (messgae: string) => void;
    setMentions: (currMentions: mentionType[]) => void;
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
    mentions: [],
    // setIsSending: (status) => set({ isSending: status }),
    // setIsError: (status) => set({ isError: status }),
    actions: {
      startSending: () => set({ isSending: true, error: '', isSuccess: false }),
      setMentions: (currMentions) => set({ mentions: currMentions }),
      onSuccess: () =>
        set((state) => ({
          isSending: false,
          isSuccess: true,
          error: '',
          tweetText: '',
          mentoins: [],
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
export const useMentions = () => useAddTweetStore((state) => state.mentions);
