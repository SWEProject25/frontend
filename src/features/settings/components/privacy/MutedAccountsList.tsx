'use client';
import { useState } from 'react';
import ListItem from '@/components/ui/ListItem';
import UserCard from '@/components/ui/UserCard';
import { MUTED_USERS, BlockedUser } from '../../constants/BLOCKED_USERS';

export default function MutedAccountsList() {
  const [mutedUsers] = useState<BlockedUser[]>(MUTED_USERS);

  if (mutedUsers.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-text-inactive text-base mb-2">
          You aren&apos;t muting anyone
        </p>
        <p className="text-text-secondary text-sm">
          When you mute someone, you&apos;ll see them here.
        </p>
      </div>
    );
  }

  return (
    <nav className="flex flex-col">
      {mutedUsers.map((user) => (
        <ListItem key={user.id} href={`/profile/${user.handle.slice(1)}`}>
          <UserCard
            name={user.name}
            handle={user.handle}
            verified={user.verified}
            avatarUrl={user.avatarUrl}
            isMuted={true}
            actionType="mute"
          />
        </ListItem>
      ))}
    </nav>
  );
}
