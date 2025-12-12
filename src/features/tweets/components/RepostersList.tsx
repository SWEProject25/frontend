'use client';
import React from 'react';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import UserCard from '@/components/ui/UserCard';
import { useGetRepostersByTweetId } from '../hooks/tweetQueries';
import Loader from '@/components/generic/Loader';

interface RepostersListProps {
  tweetId: number;
  'data-testid'?: string;
}

export default function RepostersList({
  tweetId,
  'data-testid': testId = 'reposters-list',
}: RepostersListProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetRepostersByTweetId(tweetId);

  const reposters = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const hasInitialData = reposters.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full" data-testid={testId}>
      <InfiniteScroll
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={fetchNextPage}
        hasMoreData={hasNextPage ?? false}
        hasInitialData={hasInitialData}
        data-testid={`${testId}-infinite-scroll`}
      >
        <div className="divide-y divide-border" data-testid={`${testId}-items`}>
          {reposters.map((reposter) => (
            <div
              key={reposter.id}
              className="p-4 hover:bg-muted transition-colors"
              data-testid={`${testId}-item-${reposter.id}`}
            >
              <UserCard
                name={reposter.name}
                userId={reposter.id}
                handle={`@${reposter.username}`}
                avatarUrl={reposter.profileImageUrl ?? undefined}
                actionType="repost"
                linkTo={`/${reposter.username}`}
                data-testid={`${testId}-user-card-${reposter.id}`}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
