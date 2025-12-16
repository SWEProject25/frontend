import Image from 'next/image';
import { mediaType } from '../types/components';
import { EXTERNAL_GIF, LOCAL_MEDIA } from '../constants/mediaConstants';
import Video from './Video';
import { useAddPostContext } from '@/features/timeline/store/AddPostContext';
export default function MediaItem({
  id,
  media,
  onClick,
}: {
  media: mediaType;
  id: string;
  onClick: () => void;
}) {
  const selectors = useAddPostContext();

  const { removeMedia } = selectors.useActions();
  return (
    <div className="flex flex-col ">
      <div className={`relative  aspect-square bg-black `}>
        {media.type === EXTERNAL_GIF ||
        (media.type === LOCAL_MEDIA &&
          media.data.type.split('/')[0].toLowerCase() === 'image') ? (
          <>
            <Image
              data-testid={`image-${media.id}`}
              fill
              className="object-fill"
              src={
                media.type === LOCAL_MEDIA
                  ? URL.createObjectURL(media.data)
                  : media.data.images.original.url
              }
              sizes="(max-width: 640px) 100vw, 514px"
              alt={
                media.type === LOCAL_MEDIA ? media.data.name : media.data.title
              }
            />
            {(media.type === EXTERNAL_GIF ||
              (media.type === LOCAL_MEDIA &&
                media.data.type.split('/')[1].toLowerCase() === 'gif')) && (
              <div className=" hover:cursor-default text-base font-bold text-white absolute bottom-2 left-2 rounded-xl w-10 justify-center h-6 flex bg-black ">
                GIF
              </div>
            )}
          </>
        ) : (
          <Video id={media.id} video={media.data} />
        )}
        <div className="absolute top-0  right-2 flex justify-between ">
          {' '}
          {/* <button className="px-4 py-1.5 bg-media-button cursor-pointer hover:bg-media-button-hover text-white text-sm font-semibold rounded-full">
            Edit
          </button> */}
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
      {media.type === EXTERNAL_GIF && (
        <div className="px-3 flex items-center gap-x-4 text-base">
          <span
            data-testid={`via`}
            className=" font-semibold  hover:underline cursor-default flex items-center  text-text-inactive text-xs"
          >
            Via
          </span>
          <Image
            sizes="(max-width: 50) 100px, 100px"
            alt="giphy"
            width={20}
            height={20}
            src="https://abs.twimg.com/a/1501527574/img/t1/icon_giphy.png"
          />
          <span
            data-testid={`giphy`}
            className=" font-bold  hover:underline cursor-default flex items-center  text-text-inactive text-xl"
          >
            GIPHY
          </span>
        </div>
      )}
    </div>
  );
}
