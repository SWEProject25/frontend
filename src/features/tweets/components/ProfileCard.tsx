'use client';

import { GrokIcon } from '@/components/ui/icons/BrandIcons';
import CardAvatar from './CardAvatar';
import CardUserInfo from './CardUserInfo';
import FollowBtn from '@/components/generic/buttons/FollowBtn';

type User = {
  id: number;
  name: string;
  username: string;
  verified: boolean;
  avatar: string | null;
  isFollowedByMe?: boolean;
};

export default function ProfileCard({ data }: { data: User }) {
  return (
    <div className="w-64 h-full bg-black text-white rounded-2xl p-4 shadow-lg shadow-white/20 border border-gray-800 hover:border-gray-700 transition-all duration-200 mt-2">
      <div className="flex justify-between items-start">
        <CardAvatar
          avatar={data.avatar}
          name={data.name}
          username={data.username}
        />
        <FollowBtn isFollowed={data.isFollowedByMe} />
      </div>
      <div className="mt-3">
        <div className="flex items-center space-x-1">
          <CardUserInfo data={data} direction="vertical" />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-300">{'Bio goes here'}</p>
      <div className="mt-3 flex space-x-3 text-sm">
        <span className="text-gray-400">
          <span className="font-semibold text-white">{'1.5k'}</span> Following
        </span>
        <span className="text-gray-400">
          <span className="font-semibold text-white">{'500'}</span> Followers
        </span>
      </div>

      <div className="mt-3 border border-gray-700 rounded-full py-2 text-center text-sm text-white hover:bg-gray-900 cursor-pointer transition flex items-center justify-center gap-2">
        <GrokIcon />
        <span className="font-bold">Profile Summary</span>
      </div>
    </div>
  );
}
