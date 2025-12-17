import React from 'react';

export default function Video({ video, id }: { video: File; id: string }) {
  return (
    <video
      data-testid={`video-${id}`}
      className="w-full h-full rounded-2xl object-contain cursor-pointer bg-black"
      controls
      preload="none"
      loop
    >
      <source src={URL.createObjectURL(video)} type={video.type}></source>
    </video>
  );
}
