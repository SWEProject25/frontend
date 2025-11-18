'use client';
import { useState } from 'react';
import ListItem from '@/components/ui/ListItem';
import UserCard from '@/components/ui/UserCard';
import { BLOCKED_USERS, BlockedUser } from '../../constants/BLOCKED_USERS';

export default function BlockedAccountsList() {
  const [blockedUsers] = useState<BlockedUser[]>(BLOCKED_USERS);

  if (blockedUsers.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-text-inactive text-base mb-2">
          You aren&apos;t blocking anyone
        </p>
        <p className="text-text-secondary text-sm">
          When you block someone, you&apos;ll see them here.
        </p>
      </div>
    );
  }

  return (
    <nav className="flex flex-col">
      {blockedUsers.map((user) => (
        <ListItem key={user.id} href={`/profile/${user.handle.slice(1)}`}>
          <UserCard
            name={user.name}
            userId={user.id}
            handle={user.handle}
            verified={user.verified}
            avatarUrl={user.avatarUrl}
            isBlocked={true}
            actionType="block"
          />
        </ListItem>
      ))}
    </nav>
  );
}
