'use client';

import { GrokIcon } from '@/components/ui/icons/BrandIcons';
import CardAvatar from './CardAvatar';
import CardUserInfo from './CardUserInfo';
import FollowBtn from '@/components/generic/buttons/FollowBtn';
import { useProfileByUserId } from '@/features/profile/hooks';
import Loader from '@/components/generic/Loader';
import { useProfileStore } from '@/features/profile';
import { useEffect } from 'react';

interface ProfileCardProps {
  userId: number;
}

export default function ProfileCard({ userId }: ProfileCardProps) {
  const { data: profileData, isLoading, error } = useProfileByUserId(userId);
  const { setCurrentProfile } = useProfileStore();
  useEffect(() => {
    if (profileData?.data) {
      setCurrentProfile(profileData.data);
    }
    return () => {
      setCurrentProfile(null);
    };
  }, [profileData, setCurrentProfile]);

  if (isLoading) {
    return (
      <div className="w-64 h-full bg-black text-white rounded-2xl p-4 shadow-lg shadow-white/20 border border-gray-800 flex items-center justify-center mt-2">
        <Loader />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="w-64 h-full bg-black text-white rounded-2xl p-4 shadow-lg shadow-white/20 border border-gray-800 flex items-center justify-center mt-2">
        <div className="text-gray-400 text-sm">
          {error?.message || 'Profile not found'}
        </div>
      </div>
    );
  }

  const profile = profileData.data;

  const userData = {
    id: profile.id,
    name: profile.name,
    username: profile.User.username,
    verified: false,
    avatar: profile.profile_image_url ?? null,
  };

  return (
    <div className="w-64 h-full bg-black text-white rounded-2xl p-4 shadow-lg shadow-white/20 border border-gray-800 hover:border-gray-700 transition-all duration-200 mt-2">
      <div className="flex justify-between items-start">
        <CardAvatar
          avatar={profile.profile_image_url ?? null}
          name={profile.name}
          username={profile.User.username}
        />
        <FollowBtn
          userId={profile.user_id}
          isFollowed={profile.is_followed_by_me ?? false}
        />
      </div>
      <div className="mt-3">
        <div className="flex items-center space-x-1">
          <CardUserInfo data={userData} direction="vertical" />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-300">
        {profile.bio || 'No bio available'}
      </p>
      <div className="mt-3 flex space-x-3 text-sm">
        <span className="text-gray-400">
          <span className="font-semibold text-white">
            {profile.following_count}
          </span>{' '}
          Following
        </span>
        <span className="text-gray-400">
          <span className="font-semibold text-white">
            {profile.followers_count}
          </span>{' '}
          Followers
        </span>
      </div>

      <div className="mt-3 border border-gray-700 rounded-full py-2 text-center text-sm text-white hover:bg-gray-900 cursor-pointer transition flex items-center justify-center gap-2">
        <GrokIcon />
        <span className="font-bold">Profile Summary</span>
      </div>
    </div>
  );
}
