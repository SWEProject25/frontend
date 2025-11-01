import { getQueryClient } from '@/lib/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import TweetList from './TweetList';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';
import { timelineApi } from '../services/timelineAPi';

export default async function TweetFeed() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
    queryFn: ({ pageParam }) => {
      timelineApi.getForYouTweets(pageParam);
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TweetList />
    </HydrationBoundary>
  );
}
