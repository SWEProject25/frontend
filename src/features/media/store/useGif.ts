import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import GifData from '../types/components';

interface GifState {
  isOpen: boolean;
  search: string;
  actions: {
    open: () => void;
    close: () => void;
    setSearch: (text: string) => void;
  };
}

const useGif = create<GifState>()(
  devtools((set) => ({
    isOpen: false,
    search: '',
    actions: {
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setSearch: (text) => set({ search: text }),
    },
  }))
);
export const useGifVisibility = () => useGif((state) => state.isOpen);
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
