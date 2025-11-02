import React from 'react';

export default function Video({ video }: { video: File }) {
  return (
    <video
      data-testid={`video-${video.name}`}
      className="w-full h-auto max-h-[600px] rounded-2xl object-contain cursor-pointer bg-black"
      controls
      preload="none"
      loop
    >
      <source src={URL.createObjectURL(video)} type={video.type}></source>
    </video>
  );
}
