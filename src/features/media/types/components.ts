import { LOCAL_MEDIA } from '../constants/mediaConstants';
import { EXTERNAL_GIF } from '../constants/mediaConstants';
export default interface GifData {
  id: string;
  title: string;
  images: {
    fixed_height_small: {
      url: string;
      width: string;
      height: string;
    };
    fixed_height_downsampled: {
      url: string;
      width: string;
      height: string;
    };
    fixed_width_downsampled: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
      width: string;
      height: string;
    };
  };
}
export type mediaType =
  | { id: string; type: typeof LOCAL_MEDIA; data: File }
  | { id: string; type: typeof EXTERNAL_GIF; data: GifData };
