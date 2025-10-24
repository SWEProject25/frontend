'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
const GIF_API_KEY = 't0JUs64tvKcw5xaMCbIX640GKnqJ6Ybi';
interface GifData {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
  };
}
export default function GIFTweet() {
  const [state, setState] = useState<GifData[]>([]);
  useEffect(function () {
    fetch(
      'https://api.giphy.com/v1/gifs/trending?api_key=t0JUs64tvKcw5xaMCbIX640GKnqJ6Ybi&limit=25&offset=0&rating=g&bundle=messaging_non_clips'
    )
      .then((res) => res.json())
      .then((data) => setState(data.data));
  }, []);
  console.log(state);
  return (
    <div>
      {state.map((gif) => (
        <Image
          priority={true}
          key={gif.id}
          alt={gif.title}
          src={gif.images.fixed_height.url}
          width={Number(gif.images.fixed_height.width)}
          height={Number(gif.images.fixed_height.height)}
        />
      ))}
    </div>
  );
}
