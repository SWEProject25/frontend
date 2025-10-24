import React from 'react';
import Image from 'next/image';

type contentTypes = {
  text?: string;
  image?: string;
};

export default function Content({ content }: { content: contentTypes }) {
  return (
    <div className="">
      <p className="text-gray-200">{content.text}</p>
      {content.image && (
        <div className="mt-3 rounded-xl overflow-auto relative h-70 w-full">
          <Image
            fill
            src={content.image}
            alt="Tweet image"
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>
      )}
    </div>
  );
}
