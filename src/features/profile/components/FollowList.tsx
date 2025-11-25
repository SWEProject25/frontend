'use client';
import React from 'react';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import UserCard from '@/components/ui/UserCard';
import { FollowerDto } from '@/types/userInteractions';
import { useAuthStore } from '@/features/authentication/store/authStore';

interface FollowListProps {
  // Using any to avoid complex type inference issues with useInfiniteQuery
  // The query should be a result from useInfiniteFollowers or useInfiniteFollowing
  query: any;
}

export default function FollowList({ query }: FollowListProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    query;
  const currentUser = useAuthStore((s) => s.user);

  const users: FollowerDto[] = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: { data: FollowerDto[] }) => page.data);
  }, [data]);

  const hasInitialData = users.length > 0;
  console.log('FollowList users:', users);

  return (
    <div className="w-full" data-testid="follow-list">
      <InfiniteScroll
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={fetchNextPage}
        hasMoreData={hasNextPage ?? false}
        hasInitialData={hasInitialData}
        data-testid="follow-list-infinite-scroll"
      >
        <div className="divide-y divide-border" data-testid="follow-list-items">
          {users.map((user) => {
            const isCurrentUser = currentUser?.username === user.username;
            return (
              <div
                key={user.id}
                className="p-4 hover:bg-muted transition-colors"
                data-testid={`follow-list-item-${user.id}`}
              >
                <UserCard
                  name={user.displayName}
                  userId={user.id}
                  handle={`@${user.username}`}
                  verified={user.verified}
                  avatarUrl={user.profileImageUrl ?? undefined}
                  isFollowed={user.is_followed_by_me}
                  actionType={isCurrentUser ? undefined : 'follow'}
                  linkTo={`/${user.username}`}
                  data-testid={`follow-list-user-card-${user.id}`}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
