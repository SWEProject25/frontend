'use client';
import ListItem from '@/components/ui/ListItem';
import UserCard from '@/components/ui/UserCard';
import Loader from '@/components/generic/Loader';
import { useGetBlockedUsers } from '@/hooks/useInteractions';
import { BlockedUserDto } from '@/types/userInteractions';

export default function BlockedAccountsList() {
  const { data, isLoading, isError, error } = useGetBlockedUsers({
    page: 1,
    limit: 50,
  });

  console.log('Blocked users data:', data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="px-4 py-12 text-center"
        data-testid="blocked-accounts-error"
      >
        <p className="text-error text-base mb-2">
          Failed to load blocked users
        </p>
        <p className="text-text-secondary text-sm">
          {error?.message || 'Please try again later'}
        </p>
      </div>
    );
  }

  const blockedUsers = data?.data || [];

  if (blockedUsers.length === 0) {
    return (
      <div
        className="px-4 py-12 text-center"
        data-testid="blocked-accounts-empty"
      >
        <p
          className="text-text-inactive text-base mb-2"
          data-testid="blocked-accounts-empty-title"
        >
          You aren&apos;t blocking anyone
        </p>
        <p
          className="text-text-secondary text-sm"
          data-testid="blocked-accounts-empty-description"
        >
          When you block someone, you&apos;ll see them here.
        </p>
      </div>
    );
  }

  return (
    <nav className="flex flex-col" data-testid="blocked-accounts-list">
      {blockedUsers.map((user: BlockedUserDto) => (
        <ListItem
          key={user.id}
          href={`/${user.username}`}
          data-testid={`blocked-account-item-${user.id}`}
        >
          <UserCard
            name={user.displayName}
            userId={user.id}
            handle={`@${user.username}`}
            verified={false}
            avatarUrl={user.profileImageUrl ?? undefined}
            isBlocked={true}
            actionType="block"
            data-testid={`blocked-account-card-${user.id}`}
          />
        </ListItem>
      ))}
    </nav>
  );
}
