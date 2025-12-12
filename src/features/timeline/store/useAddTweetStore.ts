'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mentionType } from '../components/TweetText';
import { ADD_TWEET } from '../constants/tweetConstants';
import {
  usePostActions,
  usePostError,
  usePostIsSending,
  usePostIsSuccess,
  usePostMentions,
  usePostPlaceHolder,
  usePostTweetText,
} from './useAddPostStore';
import {
  useReplyQuoteActions,
  useReplyQuoteError,
  useReplyQuoteIsSending,
  useReplyQuoteIsSuccess,
  useReplyQuoteMentions,
  useReplyQuoteTweetText,
} from './useAddReplyQuoteStore';

interface AddTweetState {
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  defaultReplyOption: number;
  selectedReplyOption: number;
  updateReplyOption: (id?: number) => void;

  tweetText: string;
  isSending: boolean;
  error: string;
  isSuccess: boolean;
  mentions: mentionType[];
  postType: string;

  placeHolder: string;

  actions: {
    startSending: () => void;
    setTweetText: (text: string) => void;
    onSuccess: () => void;
    seterror: (messgae: string) => void;
    setMentions: (currMentions: mentionType[]) => void;
    setPostType: (type: string) => void;
    setPlaceHolder: (holder: string) => void;
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
    isSending: false,
    error: '',
    isSuccess: false,
    mentions: [],
    postType: ADD_TWEET.POST,
    placeHolder: "What's happening?",

    actions: {
      startSending: () => set({ isSending: true, error: '', isSuccess: false }),
      setTweetText: (text) => set({ tweetText: text }),

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
      setPostType: (type) => set({ postType: type }),
      setPlaceHolder: (holder) => set({ placeHolder: holder }),
    },
  }))
);

export default useAddTweetStore;
export const useActions = () => {
  const type = usePostType();
  const postActions = usePostActions();
  const replyQuoteActions = useReplyQuoteActions();
  return type === ADD_TWEET.POST ? postActions : replyQuoteActions;
};
export const useMentions = () => {
  const type = usePostType();
  const postMentions = usePostMentions();
  const replyQuoteMentions = useReplyQuoteMentions();
  return type === ADD_TWEET.POST ? postMentions : replyQuoteMentions;
};
export const useTweetText = () => {
  const type = usePostType();
  const postTweetText = usePostTweetText();
  const replyQuoteTweetText = useReplyQuoteTweetText();
  return type === ADD_TWEET.POST ? postTweetText : replyQuoteTweetText;
};
export const useIsSending = () => {
  const type = usePostType();
  const postIsSending = usePostIsSending();
  const replyQuoteIsSending = useReplyQuoteIsSending();
  return type === ADD_TWEET.POST ? postIsSending : replyQuoteIsSending;
};

export const useError = () => {
  const type = usePostType();
  const postError = usePostError();
  const replyQuoteError = useReplyQuoteError();
  return type === ADD_TWEET.POST ? postError : replyQuoteError;
};

export const useIsSuccess = () => {
  const type = usePostType();
  const postIsSuccess = usePostIsSuccess();
  const replyQuoteIsSuccess = useReplyQuoteIsSuccess();
  return type === ADD_TWEET.POST ? postIsSuccess : replyQuoteIsSuccess;
};

export const usePostType = () => useAddTweetStore((state) => state.postType);

export const useTweetPlaceHolder = () => {
  const type = usePostType();
  const postPlaveHolder = usePostPlaceHolder();

  return type === ADD_TWEET.POST
    ? "What's happening?"
    : ADD_TWEET.REPLY
      ? 'Post your reply'
      : 'Add a comment';
};
