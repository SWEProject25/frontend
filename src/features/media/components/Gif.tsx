import { getQueryClient } from '@/lib/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { gifApi } from '../services/gifAPi';
import GifModal from './GifModal';
import { prefetchSearchCategories } from '../hooks/mediaQueries';

export default async function Gif() {
  const queryClient = getQueryClient();

  await prefetchSearchCategories();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GifModal />;
    </HydrationBoundary>
  );
}
