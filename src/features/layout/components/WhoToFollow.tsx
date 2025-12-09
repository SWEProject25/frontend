'use client';

import React from 'react';
import Link from 'next/link';
import UserCard from '@/components/ui/UserCard';
import { useSuggestedUsers } from '../hooks/useSuggestedUsers';
import XLoader from '@/components/generic/XLoader';

export default function WhoToFollow() {
  const { data: suggestedUsers, isLoading, isError } = useSuggestedUsers(5);

  // Fallback static suggestions if API fails
  const fallbackSuggestions = [
    {
      name: 'Bassem Youssef',
      id: 1,
      handle: '@Byoussef',
      verified: true,
      isFollowed: false,
      avatarUrl: undefined,
      bio: undefined,
    },
    {
      name: 'mbc3',
      handle: '@mbc3',
      id: 2,
      verified: true,
      isFollowed: false,
      avatarUrl: undefined,
      bio: undefined,
    },
  ];

  const suggestions =
    Array.isArray(suggestedUsers) && suggestedUsers.length > 0
      ? suggestedUsers.map((user) => ({
          name: user.profile.name,
          id: user.id,
          handle: `@${user.username}`,
          verified: user.isVerified,
          isFollowed: false,
          avatarUrl: user.profile.profileImageUrl,
          bio: user.profile.bio,
        }))
      : fallbackSuggestions;

  return (
    <div className="bg-black rounded-2xl p-4 border border-gray-700">
      <h2 className="text-xl font-bold mb-5 text-white">Who to follow</h2>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <XLoader />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {suggestions.map((user) => (
              <UserCard
                key={user.id}
                name={user.name}
                userId={user.id}
                handle={user.handle}
                verified={user.verified}
                isFollowed={user.isFollowed}
                avatarUrl={user.avatarUrl}
                bio={user.bio}
              />
            ))}
          </div>
          <Link
            href="/explore"
            className="text-blue-400 hover:underline mt-3 text-sm block"
          >
            Show more
          </Link>
        </>
      )}
    </div>
  );
}
