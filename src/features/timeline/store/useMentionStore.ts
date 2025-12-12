'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { usePostType } from './useAddTweetStore';
import {
  usePostActions,
  usePostCurrentKey,
  usePostIsOpen,
  usePostMention,
  usePostMentionIsDone,
} from './useAddPostStore';
import {
  useReplyQuoteActions,
  useReplyQuoteCurrentKey,
  useReplyQuoteIsOpen,
  useReplyQuoteMention,
  useReplyQuoteMentionIsDone,
} from './useAddReplyQuoteStore';
import { ADD_TWEET } from '../constants/tweetConstants';

interface MentionState {
  mention: string;
  isOpen: boolean;
  mentionIsdone: string;
  currentKey: string;
  // setIsSending: (status: boolean) => void;
  // setIsError: (status: boolean) => void;
  actions: {
    setMention: (text: string) => void;
    setIsOpen: (isOpen: boolean) => void;
    setIsDone: (isDone: string) => void;
    setKeyDown: (key: string) => void;
  };
}

const useMentionStore = create<MentionState>()(
  devtools((set) => ({
    mention: '',
    isOpen: false,
    mentionIsdone: '',
    currentKey: '',
    actions: {
      setMention: (text) => set({ mention: text }),
      setIsOpen: (isOpen) => set({ isOpen: isOpen }),
      setIsDone: (isDone) => set({ mentionIsdone: isDone }),
      setKeyDown: (key) => set({ currentKey: key }),
    },
  }))
);

export default useMentionStore;
export const useActions = () => {
  const type = usePostType();
  const postActions = usePostActions();
  const replyQuoteActions = useReplyQuoteActions();
  return type === ADD_TWEET.POST ? postActions : replyQuoteActions;
};

export const useMention = () => {
  const type = usePostType();
  const postMention = usePostMention();
  const replyQuoteMentoin = useReplyQuoteMention();
  return type === ADD_TWEET.POST ? postMention : replyQuoteMentoin;
};

export const useCurrentKey = () => {
  const type = usePostType();
  const postCurrentKey = usePostCurrentKey();
  const replyQuoteCurrentKey = useReplyQuoteCurrentKey();
  return type === ADD_TWEET.POST ? postCurrentKey : replyQuoteCurrentKey;
};

export const useMentionIsDone = () => {
  const type = usePostType();
  const postMentionIsDone = usePostMentionIsDone();
  const replyQuoteMentionIsDone = useReplyQuoteMentionIsDone();
  return type === ADD_TWEET.POST ? postMentionIsDone : replyQuoteMentionIsDone;
};
export const useIsOpen = () => {
  const type = usePostType();
  const postIsOpen = usePostIsOpen();
  const replyQuoteIsOpen = useReplyQuoteIsOpen();
  return type === ADD_TWEET.POST ? postIsOpen : replyQuoteIsOpen;
};
