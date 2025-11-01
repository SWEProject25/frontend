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
    <div className="w-full h-full">
      {content.text && (
        <p className="text-gray-200 text-left">{content.text}</p>
      )}
      {content.media && content.media.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-3 w-full">
          {content.media.map((item, idx) =>
            item.type === 'image' ? (
              // <div
              //   key={idx}
              //   className="rounded-xl overflow-auto relative h-70 w-full"
              // >
              //   <Image
              //     fill
              //     src={item.url}
              //     alt="Tweet image"
              //     className="w-full h-auto rounded-xl object-cover"
              //   />
              // </div>
              <div
                key={idx}
                className="relative max-w-full max-h-[400px] w-full flex justify-start items-start overflow-hidden rounded-xl bg-black/5"
              >
                <Image
                  src={item.url}
                  alt="Tweet image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-auto w-auto max-w-full max-h-[600px] rounded-xl object-contain"
                />
              </div>
            ) : item.type === 'video' ? (
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
