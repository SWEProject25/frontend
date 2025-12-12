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

interface AddPostState {
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
  };
}

const useAddPostStore = create<AddPostState>()(
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

    placeHolder: "What's happening?",

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
          mentoins: [],
        })),
      seterror: (message) =>
        set({ isSending: false, error: message, isSuccess: false }),

      setMention: (text) => set({ mention: text }),
      setIsOpen: (isOpen) => set({ isOpen: isOpen }),
      setIsDone: (isDone) => set({ mentionIsdone: isDone }),
      setKeyDown: (key) => set({ currentKey: key }),

      setPlaceHolder: (holder) => set({ placeHolder: holder }),
    },
  }))
);

export default useAddPostStore;
export const usePostActions = () => useAddPostStore((state) => state.actions);
export const usePostMentions = () => useAddPostStore((state) => state.mentions);
export const usePostIsSending = () =>
  useAddPostStore((state) => state.isSending);
export const usePostIsSuccess = () =>
  useAddPostStore((state) => state.isSuccess);
export const usePostError = () => useAddPostStore((state) => state.error);
export const usePostTweetText = () =>
  useAddPostStore((state) => state.tweetText);
export const usePostMedia = () => useAddPostStore((state) => state.media);
export const usePostEmoji = () => useAddPostStore((state) => state.emoji);

export const usePostMention = () => useAddPostStore((state) => state.mention);
export const usePostCurrentKey = () =>
  useAddPostStore((state) => state.currentKey);
export const usePostMentionIsDone = () =>
  useAddPostStore((state) => state.mentionIsdone);
export const usePostIsOpen = () => useAddPostStore((state) => state.isOpen);

export const usePostPlaceHolder = () =>
  useAddPostStore((state) => state.placeHolder);
