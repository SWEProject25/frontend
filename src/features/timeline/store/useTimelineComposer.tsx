'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { mediaType } from '@/features/media/types/components';
import {
  EXTERNAL_GIF,
  LOCAL_MEDIA,
} from '@/features/media/constants/mediaConstants';
import { AddPostState } from './useAddPostStore';

export const useTimelineComposerStore = create<AddPostState>()(
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
      startSending: () => set({ isSending: true, error: '', isSuccess: false }),
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

export const timelineComposerSelectors = {
  useActions: () => useTimelineComposerStore((state) => state.actions),
  useMentions: () => useTimelineComposerStore((state) => state.mentions),
  useIsSending: () => useTimelineComposerStore((state) => state.isSending),
  useIsSuccess: () => useTimelineComposerStore((state) => state.isSuccess),
  useError: () => useTimelineComposerStore((state) => state.error),
  useTweetText: () => useTimelineComposerStore((state) => state.tweetText),
  useMedia: () => useTimelineComposerStore((state) => state.media),
  useEmoji: () => useTimelineComposerStore((state) => state.emoji),
  useMention: () => useTimelineComposerStore((state) => state.mention),
  useCurrentKey: () => useTimelineComposerStore((state) => state.currentKey),
  useMentionIsDone: () =>
    useTimelineComposerStore((state) => state.mentionIsdone),
  useIsOpen: () => useTimelineComposerStore((state) => state.isOpen),
  usePlaceHolder: () => useTimelineComposerStore((state) => state.placeHolder),
  useGifVisibility: () => useTimelineComposerStore((state) => state.isGifOpen),
  useGifsSearch: () => useTimelineComposerStore((state) => state.search),
  useParentId: () => useTimelineComposerStore((state) => state.parentId),
  useSelectedReplyOption: () =>
    useTimelineComposerStore((state) => state.selectedReplyOption),
};
