'use client';
import React from 'react';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import UserCard from '@/components/ui/UserCard';
import { FollowerDto } from '@/types/userInteractions';

interface FollowListProps {
  // Using any to avoid complex type inference issues with useInfiniteQuery
  // The query should be a result from useInfiniteFollowers or useInfiniteFollowing
  query: any;
}

export default function FollowList({ query }: FollowListProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    query;

  const users: FollowerDto[] = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: { data: FollowerDto[] }) => page.data);
  }, [data]);

  const hasInitialData = users.length > 0;

  return (
    <div className="w-full" data-testid="follow-list">
      <InfiniteScroll
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={fetchNextPage}
        hasMoreData={hasNextPage ?? false}
        hasInitialData={hasInitialData}
      >
        <div className="divide-y divide-border">
          {users.map((user) => (
            <div key={user.id} className="p-4 hover:bg-muted transition-colors">
              <UserCard
                name={user.displayName}
                userId={user.id}
                handle={`@${user.username}`}
                verified={user.verified}
                avatarUrl={user.profileImageUrl ?? undefined}
                bio={user.bio ?? undefined}
                isFollowed={user.is_followed_by_me ?? true}
                actionType="follow"
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
