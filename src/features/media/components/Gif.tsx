import { getQueryClient } from '@/lib/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { gifApi } from '../services/gifAPi';
import GifModal from './GifModal';
import { prefetchSearchCategories } from '../hooks/mediaQueries';

export default async function Gif() {
  const queryClient = getQueryClient();

  await prefetchSearchCategories();
  // useEffect(function () {
  //   async function fetchGif() {
  //     const response = await fetch(
  //       `${GIF_API}trending?${GIF_API_KEY}&limit=${1}&offset=0&rating=g&bundle=messaging_non_clips`
  //     );
  //     console.log(response);
  //     const data = await response.json();
  //     console.log(data.data);
  //     // setCategoryGifs(data.data);
  //     // addGifs(data.data[0]);
  //   }
  //   fetchGif();
  // }, []);
  // return <GifModal />;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GifModal />;
    </HydrationBoundary>
  );
}
