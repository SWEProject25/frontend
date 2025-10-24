'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import UserCard from '@/components/ui/UserCard';
import { BLOCKED_USERS } from '@/features/settings/constants/BLOCKED_USERS';

export default function BlockedAccountsPage() {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const handleBack = () => {
    router.push('/settings/privacy_and_safety/mute_and_block');
  };

  const handleUnblock = (userId: string, userName: string) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    console.log(`Unblocking user: ${userName}`);

    // Simulate API call
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
      // In a real app, you would remove the user from the list
    }, 1500);
  };

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Blocked accounts"
        onBack={handleBack}
        showArrow={true}
      />

      {/* User List */}
      <nav className="flex flex-col">
        {BLOCKED_USERS.length > 0 ? (
          BLOCKED_USERS.map((user) => (
            <ListItem key={user.id} href={`/profile/${user.handle.slice(1)}`}>
              <UserCard
                name={user.name}
                handle={user.handle}
                verified={user.verified}
                avatarUrl={user.avatarUrl}
                action={{
                  label: 'Unblock',
                  onClick: () => handleUnblock(user.id, user.name),
                  variant: 'outline',
                  loading: loadingStates[user.id],
                }}
              />
            </ListItem>
          ))
        ) : (
          <div className="px-4 py-12 text-center">
            <p className="text-text-inactive text-base mb-2">
              You aren&apos;t blocking anyone
            </p>
            <p className="text-text-secondary text-sm">
              When you block someone, you&apos;ll see them here.
            </p>
          </div>
        )}
      </nav>
    </div>
  );
}
