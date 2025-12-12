import React, { useState } from 'react';

import Icon from '@/components/ui/home/Icon';
import MediaItem from './MediaItem';
import { useAddPostContext } from '@/features/timeline/store/AddPostContext';

export default function MediaPreview() {
  const selectors = useAddPostContext();

  const media = selectors.useMedia();

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media.length) return null;

  return (
    <div>
      <div
        data-testid="media-preview"
        className={`${media.length == 1 ? 'w-full' : ' grid grid-cols-2 gap-1 max-h-[300px]'} max-w-[514px] mx-auto rounded-2xl overflow-hidden`}
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
            key={media[currentIndex].id}
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
              key={media[currentIndex + 1].id}
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
    </div>
  );
}
