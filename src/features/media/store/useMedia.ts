import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import GifData, { mediaType } from '../types/components';
import { EXTERNAL_GIF, LOCAL_MEDIA } from '../constants/mediaConstants';
import { usePostType } from '@/features/timeline/store/useAddTweetStore';
import {
  usePostActions,
  usePostEmoji,
  usePostMedia,
} from '@/features/timeline/store/useAddPostStore';
import {
  useReplyQuoteActions,
  useReplyQuoteEmoji,
  useReplyQuoteMedia,
} from '@/features/timeline/store/useAddReplyQuoteStore';
import { ADD_TWEET } from '@/features/timeline/constants/tweetConstants';

interface MediaState {
  media: mediaType[];
  emoji: string;
  actions: {
    addMedia: (newMedia: File[]) => void;
    removeMedia: (id: string) => void;
    clearMedia: () => void;
    clearEmoji: () => void;
    setEmoji: (emoji: string) => void;
    addGifs: (gif: GifData) => void;
  };
}

const useMediaStore = create<MediaState>()(
  devtools((set) => ({
    media: [],
    emoji: '',

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
    },
  }))
);

export default useMediaStore;
export const useMediaActions = () => {
  const type = usePostType();
  const postMediaActions = usePostActions();
  const replyQuoteMediaActions = useReplyQuoteActions();
  return type === ADD_TWEET.POST ? postMediaActions : replyQuoteMediaActions;
};
export const useEmoji = () => {
  const type = usePostType();
  const postEmoji = usePostEmoji();
  const replyQuoteEMoji = useReplyQuoteEmoji();
  return type === ADD_TWEET.POST ? postEmoji : replyQuoteEMoji;
};
export const useMedia = () => {
  const type = usePostType();
  const postMedia = usePostMedia();
  const replyQuoteMedia = useReplyQuoteMedia();
  return type === ADD_TWEET.POST ? postMedia : replyQuoteMedia;
};
