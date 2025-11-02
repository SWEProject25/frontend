'use client';
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import Avatar from '@/components/generic/Avatar';
import { useAuthStore } from '@/features/authentication/store/authStore';

export default function ProfileSection() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="flex items-center justify-between hover:bg-gray-900 rounded-full p-3 mb-3 cursor-pointer transition-colors ">
      <div className="flex items-center gap-3">
        <Avatar
          avatarImage={user.profileImageUrl ?? undefined}
          name={user.name}
          size="sm"
          position="relative"
          className="border-0"
        />
        <div className="hidden xl:block">
          <p className="text-white font-semibold text-sm leading-tight">
            {user.name}
          </p>
          <p className="text-gray-400 text-sm">@{user.username}</p>
        </div>
      </div>
      <MoreHorizontal className="text-white hidden xl:block" />
    </div>
  );
}
