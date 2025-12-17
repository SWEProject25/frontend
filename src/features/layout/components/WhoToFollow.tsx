'use client';

import React from 'react';
import UserCard from '@/components/ui/UserCard';
import { useSuggestedUsers } from '../hooks/useSuggestedUsers';
import Loader from '@/components/generic/Loader';

export default function WhoToFollow() {
  const { data: suggestedUsersResponse, isLoading } = useSuggestedUsers(5);

  const suggestedUsers = suggestedUsersResponse?.data?.users || [];

  const suggestions = suggestedUsers.map((user) => ({
    name: user.profile.name,
    id: user.id,
    handle: `@${user.username}`,
    verified: user.isVerified,
    isFollowed: user.is_followed_by_me,
    avatarUrl: user.profile.profileImageUrl ?? undefined,
    bio: user.profile.bio ?? undefined,
  }));

  return (
    <div className="bg-black rounded-2xl p-4 border border-gray-700">
      <h2 className="text-xl font-bold mb-5 text-white">Who to follow</h2>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader />
        </div>
      ) : suggestions.length > 0 ? (
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
                actionType="follow"
                avatarUrl={user.avatarUrl}
                linkTo={`/${user.handle.substring(1)}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-text-secondary text-sm text-center py-4">
          No suggestions available
        </div>
      )}
    </div>
  );
}
