'use client';
import React from 'react';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import UserCard from '@/components/ui/UserCard';
import { useAuthStore } from '@/features/authentication/store/authStore';

interface UserListItem {
  id: number;
  username: string;
  displayName: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  verified?: boolean;
  is_followed_by_me?: boolean;
  is_following_me?: boolean;
}

interface GenericUserListProps {
  readonly query: any;
  readonly 'data-testid'?: string;
}

export default function GenericUserList({
  query,
  'data-testid': testId = 'generic-user-list',
}: GenericUserListProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    query;
  const currentUser = useAuthStore((s) => s.user);

  const users: UserListItem[] = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: { data: UserListItem[] }) => page.data);
  }, [data]);

  const hasInitialData = users.length > 0;

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
          {users.map((user) => {
            const isCurrentUser = currentUser?.username === user.username;
            const isFollowingMe = user.is_following_me ?? false;
            // If is_followed_by_me is undefined, default to true (for followers-you-know list)
            const isFollowed = user.is_followed_by_me ?? true;

            return (
              <div
                key={user.id}
                className="p-4 hover:bg-muted transition-colors"
                data-testid={`${testId}-item-${user.id}`}
              >
                <UserCard
                  name={user.displayName}
                  userId={user.id}
                  handle={`@${user.username}`}
                  verified={user.verified}
                  avatarUrl={user.profileImageUrl ?? undefined}
                  isFollowed={isFollowed}
                  isFollowingMe={isFollowingMe}
                  actionType={isCurrentUser ? undefined : 'follow'}
                  linkTo={`/${user.username}`}
                  data-testid={`${testId}-user-card-${user.id}`}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
