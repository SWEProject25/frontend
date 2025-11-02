import Image from 'next/image';
import useMedia from '../store/useMedia';
import { mediaType } from '../types/components';
import { EXTERNAL_GIF, LOCAL_MEDIA } from '../constants/mediaConstants';
export default function MediaItem({
  full,
  id,
  media,
  onClick,
}: {
  full: boolean;
  media: mediaType;
  id: string;
  onClick: () => void;
}) {
  const removeMedia = useMedia((state) => state.removeMedia);
  return (
    <div
      className={`relative ${full && 'w-full'} max-h-[490px] aspect-square bg-black `}
    >
      <Image
        fill
        className="object-contain"
        src={
          media.type === LOCAL_MEDIA
            ? URL.createObjectURL(media.data)
            : media.data.images.fixed_height_small.url
        }
        sizes="(max-width: 640px) 100vw, 514px"
        alt={media.type === LOCAL_MEDIA ? media.data.name : media.data.title}
      />
      <div className="absolute top-0 left-2 right-2 flex justify-between ">
        <button className="px-4 py-1.5 bg-media-button cursor-pointer hover:bg-media-button-hover text-white text-sm font-semibold rounded-full">
          Edit
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center cursor-pointer bg-media-button hover:bg-media-button-hover text-white rounded-full"
          onClick={() => {
            onClick();
            removeMedia(id);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
