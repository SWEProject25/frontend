'use client';
import React from 'react';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import UserCard from '@/components/ui/UserCard';
import { useGetLikersByTweetId } from '../hooks/tweetQueries';
import Loader from '@/components/generic/Loader';

interface LikersListProps {
  tweetId: number;
  'data-testid'?: string;
}

export default function LikersList({
  tweetId,
  'data-testid': testId = 'likers-list',
}: LikersListProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetLikersByTweetId(tweetId);

  const likers = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const hasInitialData = likers.length > 0;

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
          {likers.map((liker) => (
            <div
              key={liker.id}
              className="p-4 hover:bg-muted transition-colors"
              data-testid={`${testId}-item-${liker.id}`}
            >
              <UserCard
                name={liker.name}
                userId={liker.id}
                handle={`@${liker.username}`}
                avatarUrl={liker.profileImageUrl ?? undefined}
                verified={liker.is_verified}
                actionType="like"
                linkTo={`/${liker.username}`}
                data-testid={`${testId}-user-card-${liker.id}`}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
