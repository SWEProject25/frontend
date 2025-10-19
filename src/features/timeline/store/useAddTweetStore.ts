'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AddTweetState {
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  isOpenReplySettings: boolean;
  openReplySettings: () => void;
  tweetText: string;
  setTweetText: (text: string) => void;
}

const useAddTweetStore = create<AddTweetState>()(
  devtools((set) => ({
    scheduledTime: '',
    setScheduledTime: (time) => set({ scheduledTime: time }),
    isOpenReplySettings: false,
    openReplySettings: () => set({ isOpenReplySettings: true }),
    tweetText: '',
    setTweetText: (text) => set({ tweetText: text }),
  }))
);

export default useAddTweetStore;
