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
    <div>
      <p className="text-gray-200">{text}</p>
      <div className="mt-3 rounded-xl overflow-hidden">
        <Image
          width={600}
          height={400}
          src={image}
          alt="Tweet image"
          className="w-full h-auto rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
