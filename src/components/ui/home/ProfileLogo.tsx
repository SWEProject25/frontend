'use client';
import { useAuthStore } from '@/features/authentication/store/authStore';
import Link from 'next/link';
import Avatar from '@/components/generic/Avatar';

export default function ProfileLogo() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="flex-none w-fit mr-2 pt-3">
      <Link href={`./${user.username}`}>
        <div className="cursor-pointer transition-opacity duration-200 hover:opacity-75">
          <Avatar
            avatarImage={user.profileImageUrl ?? null}
            name={user.name}
            size="sm"
            position="relative"
            className="border-0"
          />
        </div>
      </Link>
    </div>
  );
}
