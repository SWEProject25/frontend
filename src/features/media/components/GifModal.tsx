'use client';
import XModal from '@/components/ui/hoc/XModal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGifACtions, useGifs, useGifVisibility } from '../store/useGif';
import useMedia from '@/features/media/store/useMedia';
import { useQuery } from '@tanstack/react-query';
import { gifApi } from '../services/gifAPi';
import { useEffect } from 'react';
const GIF_API_KEY = 'api_key=t0JUs64tvKcw5xaMCbIX640GKnqJ6Ybi';
const GIF_API = 'https://api.giphy.com/v1/gifs/';
export default function GifModal() {
  const router = useRouter();
  const { close } = useGifACtions();
  const isOpen = useGifVisibility();
  const handleClose = () => {
    close();
    router.back();
  };

  //   useEffect(function () {
  //     async function fetchGif() {
  //       const response = await fetch(
  //         `${GIF_API}trending?${GIF_API_KEY}&limit=${1}&offset=0&rating=g&bundle=messaging_non_clips`
  //       );
  //       console.log(response);
  //       const data = await response.json();
  //       console.log(data.data);
  //       // setCategoryGifs(data.data);
  //       // addGifs(data.data[0]);
  //     }
  //     fetchGif();
  //   }, []);
  //   return <div> loading</div>;

  //   const addGifs = useMedia((state) => state.addGifs);
  //   const [categoryGifs, setCategoryGifs] = useState<GifData[]>([]);
  //   const gifs = useGifs();

  const { getCategories } = gifApi;
  const { data: gifs, status } = useQuery({
    queryKey: ['catergoryGif'],
    queryFn: getCategories,
  });
  console.log(gifs);
  return (
    <XModal
      overlayColor="bg-[rgba(91,112,131,0.4)]"
      isOpen={isOpen}
      customLayout={false}
      onClose={handleClose}
      size="2xl"
    >
      {status === 'error' ? (
        <div> Error</div>
      ) : status === 'pending' ? (
        <div>Loading</div>
      ) : (
        <div className="flex flex-col inset-0 py-1">
          {gifs?.map((gif) => (
            <Image
              priority={true}
              key={gif.id}
              alt={gif.title}
              src={gif.images.fixed_height_small.url}
              width={Number(gif.images.fixed_height_small.width)}
              height={Number(gif.images.fixed_height_small.height)}
            />
          ))}
        </div>
      )}
    </XModal>
  );
}
