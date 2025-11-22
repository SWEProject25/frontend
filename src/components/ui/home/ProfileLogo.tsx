'use client';
import { useAuthStore } from '@/features/authentication/store/authStore';
import Link from 'next/link';
import Avatar from '@/components/generic/Avatar';

export default function ProfileLogo() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="flex-none w-fit mr-2 pt-3" data-testid="profile-logo">
      <Link href={`./${user.username}`} data-testid="profile-logo-link">
        <div className="cursor-pointer transition-opacity duration-200 hover:opacity-75">
          <Avatar
            data-testid="profile-logo-avatar"
            avatarImage={user.profile?.profileImageUrl ?? null}
            name={user.profile?.name ?? user.username}
            size="sm"
            position="relative"
            className="border-0"
          />
        </div>
      </Link>
    </div>
  );
}
