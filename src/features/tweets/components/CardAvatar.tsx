// import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/generic/Avatar';

export default function CardAvatar({
  avatar,
  name,
  username,
}: {
  avatar: string | null;
  name?: string;
  username?: string;
}) {
  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <Link href={`/${username}`} onClick={(e) => e.stopPropagation()}>
          <Avatar
            avatarImage={avatar ?? undefined}
            name={name}
            size="sm"
            position="relative"
            className="border-0"
          />
        </Link>
      </div>
    </div>
  );
}
