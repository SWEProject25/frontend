'use client';
import ListItem from '@/components/ui/ListItem';
import UserCard from '@/components/ui/UserCard';
import { useGetMutedUsers } from '@/hooks/useInteractions';
import { Loader } from '@/components/generic';

export default function MutedAccountsList() {
  const { data, isLoading } = useGetMutedUsers({ page: 1, limit: 50 });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  const mutedUsers = data?.data || [];

  if (mutedUsers.length === 0) {
    return (
      <div
        className="px-4 py-12 text-center"
        data-testid="muted-accounts-empty"
      >
        <p
          className="text-text-inactive text-base mb-2"
          data-testid="muted-accounts-empty-title"
        >
          You aren&apos;t muting anyone
        </p>
        <p
          className="text-text-secondary text-sm"
          data-testid="muted-accounts-empty-description"
        >
          When you mute someone, you&apos;ll see them here.
        </p>
      </div>
    );
  }

  return (
    <nav className="flex flex-col" data-testid="muted-accounts-list">
      {mutedUsers.map((user) => (
        <ListItem
          key={user.id}
          href={`/${user.username}`}
          data-testid={`muted-account-item-${user.id}`}
        >
          <UserCard
            name={user.displayName}
            userId={user.id}
            handle={`@${user.username}`}
            verified={false}
            avatarUrl={user.profileImageUrl ?? undefined}
            isMuted={true}
            actionType="mute"
            data-testid={`muted-account-card-${user.id}`}
          />
        </ListItem>
      ))}
    </nav>
  );
}
