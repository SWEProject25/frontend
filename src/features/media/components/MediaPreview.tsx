import React, { useState } from 'react';
import useMedia from '../store/useMedia';

import Icon from '@/components/ui/home/Icon';
import MediaItem from './MediaItem';

export default function MediaPreview() {
  const media = useMedia((state) => state.media);

  // const gifs = useMedia((state) => state.gifs);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media.length) return null;

  return (
    <div>
      <div
        className={`${media.length == 1 ? 'w-full' : ' grid grid-cols-2 gap-1 max-h-[250px]'} max-w-[514px] mx-auto rounded-2xl overflow-hidden`}
      >
        <div className="relative">
          {/* Left arrow */}
          {currentIndex > 0 && media.length > 2 && (
            <button
              data-testid={`left-arrow-${currentIndex}`}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-media-button hover:bg-media-button-hover cursor-pointer text-white rounded-full"
              onClick={() => setCurrentIndex(currentIndex - 1)}
              aria-label="left arrow"
            >
              <Icon
                disabled={true}
                color=" text-white"
                path="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
              />
            </button>
          )}
          {/* Left or only image */}
          <MediaItem
            full={media.length === 1}
            id={media[currentIndex].id}
            media={media[currentIndex]}
            onClick={() => {
              if (currentIndex !== 0) setCurrentIndex((index) => index - 1);
            }}
          />
        </div>

        {media.length > 1 && (
          <div className="relative">
            <MediaItem
              full={false}
              id={media[currentIndex + 1].id}
              media={media[currentIndex + 1]}
              onClick={() => {
                if (currentIndex === media.length - 2 && currentIndex !== 0)
                  setCurrentIndex((index) => index - 1);
              }}
            />
            {/* Right arrow */}
            {currentIndex < media.length - 2 && media.length > 2 && (
              <button
                data-testid={`right-arrow-${currentIndex}`}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-media-button hover:bg-media-button-hover cursor-pointer text-white rounded-full"
                onClick={() => setCurrentIndex(currentIndex + 1)}
                aria-label="right arrow"
              >
                <Icon
                  disabled={true}
                  color=" text-white"
                  path="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"
                />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="px-3 flex items-center gap-x-4 text-base">
        <button
          data-testid={`Tag-people`}
          className="hover:underline cursor-pointer flex items-center"
        >
          <Icon
            size="w-3.5 h-3.5"
            disabled={true}
            color="text-text-inactive"
            path="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"
          />
          <span className="  text-text-inactive text-xs">Tag people</span>
        </button>
        <button
          data-testid={`Add-descriptions`}
          className=" hover:underline cursor-pointer flex items-center"
        >
          <Icon
            size="w-3.5 h-3.5"
            disabled={true}
            color="text-text-inactive"
            path="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"
          />
          <span className="  text-text-inactive text-xs">Add descriptions</span>
        </button>
      </div>
    </div>
  );
}
