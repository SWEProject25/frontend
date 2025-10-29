// import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type User = {
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  following?: number;
  followers?: string;
  isVerified: boolean;
  isFollowed?: boolean;
};

export default function CardAvatar({
  size = 48,
  data,
}: {
  size?: number;
  data: User;
}) {
  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <Link href="/profile" onClick={(e) => e.stopPropagation()}>
          <Image
            width={size || 48}
            height={size || 48}
            src={data.avatar || '/default-avatar.png'}
            alt="User avatar"
            className="w-12 h-12 rounded-full"
          />
        </Link>
      </div>
    </div>
  );
}
