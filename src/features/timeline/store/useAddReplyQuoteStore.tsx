'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mentionType } from '../components/TweetText';
import { ADD_TWEET } from '../constants/tweetConstants';
import GifData, { mediaType } from '@/features/media/types/components';
import {
  EXTERNAL_GIF,
  LOCAL_MEDIA,
} from '@/features/media/constants/mediaConstants';

interface AddReplyQuoteState {
  tweetText: string;
  isSending: boolean;
  error: string;
  isSuccess: boolean;
  mentions: mentionType[];
  media: mediaType[];
  emoji: string;

  mention: string;
  isOpen: boolean;
  mentionIsdone: string;
  currentKey: string;

  placeHolder: string;

  parentId: number;

  isReplyOpen: boolean;
  isQuoteOpen: boolean;

  actions: {
    startSending: () => void;
    setTweetText: (text: string) => void;
    onSuccess: () => void;
    seterror: (messgae: string) => void;
    setMentions: (currMentions: mentionType[]) => void;
    addMedia: (newMedia: File[]) => void;
    removeMedia: (id: string) => void;
    clearMedia: () => void;
    clearEmoji: () => void;

    setEmoji: (emoji: string) => void;
    addGifs: (gif: GifData) => void;

    setMention: (text: string) => void;
    setIsOpen: (isOpen: boolean) => void;
    setIsDone: (isDone: string) => void;
    setKeyDown: (key: string) => void;

    setPlaceHolder: (holder: string) => void;
    clear: () => void;
    setParentId: (id: number) => void;

    setIsReplyOpen: (isOpen: boolean) => void;
    setIsQuoteOpen: (isOpen: boolean) => void;
  };
}

const useAddReplyQuoteStore = create<AddReplyQuoteState>()(
  devtools((set) => ({
    tweetText: '',
    isSending: false,
    error: '',
    isSuccess: false,
    mentions: [],
    media: [],
    emoji: '',

    mention: '',
    isOpen: false,
    mentionIsdone: '',
    currentKey: '',

    isReplyOpen: false,
    isQuoteOpen: false,

    placeHolder: 'Post your reply',
    parentId: -1,
    actions: {
      addMedia: (newMedia) =>
        set((state) => {
          const mediaWithIndx: mediaType[] = newMedia.map((med, ind) => ({
            id: `${med.lastModified}${new Date().getTime()}${med.name}${ind}`,
            type: LOCAL_MEDIA,
            data: med,
          }));
          return { media: [...state.media, ...mediaWithIndx] };
        }),
      removeMedia: (id) =>
        set((state) => {
          const newMedia = state.media.filter((med) => med.id !== id);
          return { media: newMedia };
        }),
      setEmoji: (emoji) => set({ emoji: emoji }),
      clearMedia: () => set({ media: [] }),
      clearEmoji: () => set({ emoji: '' }),

      addGifs: (gif) =>
        set((state) => {
          const mediaWithGif: mediaType = {
            id: gif.id + `${new Date().getTime()}`,
            type: EXTERNAL_GIF,
            data: gif,
          };
          return {
            media: [...state.media, mediaWithGif],
          };
        }),

      setTweetText: (text) => set({ tweetText: text }),
      startSending: () => set({ isSending: true, error: '', isSuccess: false }),
      setMentions: (currMentions) => set({ mentions: currMentions }),
      onSuccess: () =>
        set((state) => ({
          isSending: false,
          isSuccess: true,
          error: '',
          tweetText: '',
          mentions: [],
          media: [],
          emoji: '',
          mention: '',
          isOpen: false,
          mentionIsdone: '',
          currentKey: '',
          isQuoteOpen: false,
          isReplyOpen: false,
          placeHolder: 'Post your reply',
        })),
      seterror: (message) =>
        set({ isSending: false, error: message, isSuccess: false }),

      setMention: (text) => set({ mention: text }),
      setIsOpen: (isOpen) => set({ isOpen: isOpen }),
      setIsDone: (isDone) => set({ mentionIsdone: isDone }),
      setKeyDown: (key) => set({ currentKey: key }),

      setPlaceHolder: (holder) => set({ placeHolder: holder }),

      clear: () =>
        set({
          tweetText: '',
          isSending: false,
          error: '',
          isSuccess: false,
          mentions: [],
          media: [],
          emoji: '',

          mention: '',
          isOpen: false,
          mentionIsdone: '',
          currentKey: '',

          placeHolder: 'Post your reply',
        }),

      setParentId: (id) => set({ parentId: id }),
      setIsReplyOpen: (isOpen) => set({ isReplyOpen: isOpen }),
      setIsQuoteOpen: (isOpen) => set({ isQuoteOpen: isOpen }),
    },
  }))
);

export default useAddReplyQuoteStore;
export const useReplyQuoteActions = () =>
  useAddReplyQuoteStore((state) => state.actions);

export const useReplyQuoteMentions = () =>
  useAddReplyQuoteStore((state) => state.mentions);

export const useReplyQuoteIsSending = () =>
  useAddReplyQuoteStore((state) => state.isSending);
export const useReplyQuoteIsSuccess = () =>
  useAddReplyQuoteStore((state) => state.isSuccess);
export const useReplyQuoteError = () =>
  useAddReplyQuoteStore((state) => state.error);
export const useReplyQuoteTweetText = () =>
  useAddReplyQuoteStore((state) => state.tweetText);
export const useReplyQuoteMedia = () =>
  useAddReplyQuoteStore((state) => state.media);
export const useReplyQuoteEmoji = () =>
  useAddReplyQuoteStore((state) => state.emoji);
export const useReplyQuoteMention = () =>
  useAddReplyQuoteStore((state) => state.mention);
export const useReplyQuoteMentionIsDone = () =>
  useAddReplyQuoteStore((state) => state.mentionIsdone);
export const useReplyQuoteIsOpen = () =>
  useAddReplyQuoteStore((state) => state.isOpen);
export const useReplyQuoteCurrentKey = () =>
  useAddReplyQuoteStore((state) => state.currentKey);

export const useReplyQuotePlaceHolder = () =>
  useAddReplyQuoteStore((state) => state.placeHolder);

export const useReplyQuoteParentId = () =>
  useAddReplyQuoteStore((state) => state.parentId);
export const useReplyQuoteIsReplyOpen = () =>
  useAddReplyQuoteStore((state) => state.isReplyOpen);
export const useReplyQuoteIsQuoteOpen = () =>
  useAddReplyQuoteStore((state) => state.isQuoteOpen);
