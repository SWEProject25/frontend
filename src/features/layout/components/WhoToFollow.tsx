import React from 'react';
import UserCard from '@/components/ui/UserCard';

export default function WhoToFollow() {
  const suggestions = [
    {
      name: 'Bassem Youssef',
      id: 1,
      handle: '@Byoussef',
      verified: true,
      isFollowed: false,
    },
    {
      name: 'mbc3',
      handle: '@mbc3',
      id: 2,
      verified: true,
      isFollowed: false,
    },
  ];

  return (
    <div className="bg-black rounded-2xl p-4 border border-gray-700">
      <h2 className="text-xl font-bold mb-5 text-white">Who to follow</h2>
      <div className="space-y-3">
        {suggestions.map((user, i) => (
          <UserCard
            key={i}
            name={user.name}
            userId={user.id}
            handle={user.handle}
            verified={user.verified}
            isFollowed={user.isFollowed}
          />
        ))}
      </div>
      <button className="text-blue-400 hover:underline mt-3 text-sm">
        Show more
      </button>
    </div>
  );
}
