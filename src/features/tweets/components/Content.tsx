import React from 'react';
import Image from 'next/image';

export default function Content({
  text,
  image,
}: {
  text: string;
  image: string;
}) {
  return (
    <div className="">
      <p className="text-gray-200">{text}</p>
      <div className="mt-3 rounded-xl overflow-auto relative h-70 w-full">
        <Image
          fill
          src={image}
          alt="Tweet image"
          className="w-full h-auto rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
