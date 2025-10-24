'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AddTweetState {
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  selectedReplyOption: number;
  updateReplyOption: (id?: number) => void;
  tweetText: string;
  setTweetText: (text: string) => void;
}

const useAddTweetStore = create<AddTweetState>()(
  devtools((set) => ({
    scheduledTime: '',
    setScheduledTime: (time) => set({ scheduledTime: time }),
    selectedReplyOption: 0,
    updateReplyOption: (id = 1) => set({ selectedReplyOption: id }),
    tweetText: '',
    setTweetText: (text) => set({ tweetText: text }),
  }))
);

export default useAddTweetStore;
