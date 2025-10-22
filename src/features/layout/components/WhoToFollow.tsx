import React from 'react';
import UserCard from '@/components/ui/UserCard';

export default function WhoToFollow() {
  const suggestions = [
    { name: 'Bassem Youssef', handle: '@Byoussef', verified: true },
    { name: 'mbc3', handle: '@mbc3', verified: true },
  ];

  const handleFollow = (userName: string) => {
    console.log(`Following ${userName}`);
    // Add your follow logic here
  };

  return (
    <div className="bg-black rounded-2xl p-4 border border-gray-700">
      <h2 className="text-xl font-bold mb-5 text-white">Who to follow</h2>
      <div className="space-y-3">
        {suggestions.map((user, i) => (
          <UserCard
            key={i}
            name={user.name}
            handle={user.handle}
            verified={user.verified}
            action={{
              label: 'Follow',
              onClick: () => handleFollow(user.name),
              variant: 'secondary',
            }}
          />
        ))}
      </div>
      <button className="text-blue-400 hover:underline mt-3 text-sm">
        Show more
      </button>
    </div>
  );
}
