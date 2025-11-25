import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import GifData, { mediaType } from '../types/components';

interface MediaState {
  media: mediaType[];
  addMedia: (newMedia: File[]) => void;
  removeMedia: (id: string) => void;
  addGifs: (gif: GifData) => void;
  actions: {
    clearMedia: () => void;
  };
}

const useMedia = create<MediaState>()(
  devtools((set) => ({
    media: [],
    addMedia: (newMedia) =>
      set((state) => {
        const mediaWithIndx: mediaType[] = newMedia.map((med, ind) => ({
          id: `${med.lastModified}${new Date().getTime()}${med.name}${ind}`,
          type: 'localMedia',
          data: med,
        }));
        return { media: [...state.media, ...mediaWithIndx] };
      }),
    removeMedia: (id) =>
      set((state) => {
        const newMedia = state.media.filter((med) => med.id !== id);
        return { media: newMedia };
      }),
    addGifs: (gif) =>
      set((state) => {
        const mediaWithGif: mediaType = {
          id: gif.id + `${new Date().getTime()}`,
          type: 'externalGif',
          data: gif,
        };
        return {
          media: [...state.media, mediaWithGif],
        };
      }),
    actions: {
      clearMedia: () => set({ media: [] }),
    },
  }))
);

export default useMedia;
export const useMediaActions = () => useMedia((state) => state.actions);
