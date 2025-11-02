import React from 'react';
import Image from 'next/image';

type MediaItem = {
  url: string;
  type: string | 'image' | 'video';
};

type TweetContent = {
  text?: string;
  media?: MediaItem[];
};

export default function Content({ content }: { content: TweetContent }) {
  return (
    <div className="w-full">
      {content.text && (
        <p className="text-gray-200 text-left">{content.text}</p>
      )}
      {content.media && content.media.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-3 w-full">
          {content.media.map((item, idx) =>
            item.type.toLocaleLowerCase() === 'image' ? (
              <div
                key={idx}
                className="rounded-xl overflow-auto relative h-70 w-full"
              >
                <Image
                  fill
                  src={item.url}
                  alt="Tweet image"
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            ) : item.type.toLocaleLowerCase() === 'video' ? (
              <div
                key={idx}
                className="rounded-xl overflow-auto relative w-full"
              >
                <video
                  controls
                  className="w-full h-auto rounded-xl object-cover"
                  src={item.url}
                />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
