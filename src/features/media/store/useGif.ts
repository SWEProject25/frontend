import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import GifData from '../types/components';

interface GifState {
  isOpen: boolean;
  gifs: GifData[];
  search: string;
  actions: {
    open: () => void;
    close: () => void;
    setSearch: (text: string) => void;
    setGifs: (gif: GifData) => void;
  };
}

const useGif = create<GifState>()(
  devtools((set) => ({
    isOpen: false,
    gifs: [],
    search: '',
    actions: {
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setSearch: (text) => set({ search: text }),
      setGifs: (gif) =>
        set((state) => {
          return {
            gifs: [...state.gifs, gif],
          };
        }),
    },
  }))
);
export const useGifVisibility = () => useGif((state) => state.isOpen);
export const useGifs = () => useGif((state) => state.gifs);
export const useGifsSearch = () => useGif((state) => state.search);
export const useGifACtions = () => useGif((state) => state.actions);

// removeGif: (id) =>
//   set((state) => {
//     // remove from gifs list and from media list any externalGif with matching id
//     const newGifs = state.gifs.filter((g) => g.id !== id);
//     const newMedia = state.media.filter(
//       (m) => !(m.type === 'externalGif' && m.id === id)
//     );
//     return { gifs: newGifs, media: newMedia };
//   }),
