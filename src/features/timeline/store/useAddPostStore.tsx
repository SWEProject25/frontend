'use client';
import { create, UseBoundStore, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mentionType } from '../components/TweetText';
import { ADD_TWEET } from '../constants/tweetConstants';
import GifData, { mediaType } from '@/features/media/types/components';
import {
  EXTERNAL_GIF,
  LOCAL_MEDIA,
} from '@/features/media/constants/mediaConstants';

export interface AddPostState {
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

  isGifOpen: boolean;
  search: string;

  parentId: number;
  selectedReplyOption: number;
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

    open: () => void;
    close: () => void;
    setSearch: (text: string) => void;
    setParentId: (id: number) => void;
    updateReplyOption: (option: number) => void;
  };
}

export function createAddTweetStore() {
  return create<AddPostState>()(
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

      isGifOpen: false,
      search: '',

      parentId: -1,
      selectedReplyOption: -1,
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
        startSending: () =>
          set({ isSending: true, error: '', isSuccess: false }),
        setMentions: (currMentions) => set({ mentions: currMentions }),
        onSuccess: () =>
          set({
            isSending: false,
            isSuccess: true,
            error: '',
            tweetText: '',
            mentions: [],
            mention: '',
            media: [],
            emoji: '',
            isOpen: false,
            mentionIsdone: '',
            currentKey: '',

            placeHolder: "What's happening?",
          }),
        seterror: (message) =>
          set({ isSending: false, error: message, isSuccess: false }),

        setMention: (text) => set({ mention: text }),
        setIsOpen: (isOpen) => set({ isOpen: isOpen }),
        setIsDone: (isDone) => set({ mentionIsdone: isDone }),
        setKeyDown: (key) => set({ currentKey: key }),

        setPlaceHolder: (holder) => set({ placeHolder: holder }),

        open: () => set({ isGifOpen: true }),
        close: () => set({ isGifOpen: false }),
        setSearch: (text) => set({ search: text }),

        setParentId: (id) => set({ parentId: id }),
        updateReplyOption: (option) => set({ selectedReplyOption: option }),
      },
    }))
  );
}
export function createAddTweetSelectors(
  useStore: UseBoundStore<StoreApi<AddPostState>>
) {
  return {
    useActions: () => useStore((state) => state.actions),
    useMentions: () => useStore((state) => state.mentions),
    useIsSending: () => useStore((state) => state.isSending),
    useIsSuccess: () => useStore((state) => state.isSuccess),
    useError: () => useStore((state) => state.error),
    useTweetText: () => useStore((state) => state.tweetText),
    useMedia: () => useStore((state) => state.media),
    useEmoji: () => useStore((state) => state.emoji),
    useMention: () => useStore((state) => state.mention),
    useCurrentKey: () => useStore((state) => state.currentKey),
    useMentionIsDone: () => useStore((state) => state.mentionIsdone),
    useIsOpen: () => useStore((state) => state.isOpen),
    usePlaceHolder: () => useStore((state) => state.placeHolder),
    useGifVisibility: () => useStore((state) => state.isGifOpen),
    useGifsSearch: () => useStore((state) => state.search),
    useParentId: () => useStore((state) => state.parentId),
    useSelectedReplyOption: () =>
      useStore((state) => state.selectedReplyOption),
  };
}
