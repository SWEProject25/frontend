import React from 'react';
import Tweet from '../../features/tweets/components/Tweet';
import ProfileCard from '@/features/tweets/components/ProfileCard';
function Page() {
  return (
    <>
      <Tweet />
      <Tweet />
      <Tweet />
      <Tweet />
      <ProfileCard
        name="John Doe"
        username="johndoe"
        isVerified={true}
        bio="Lorem ipsum dolor sit amet."
        following={100}
        followers="1K"
        avatar="/apple.png"
        isFollowed={false}
      />
    </>
  );
}

export default Page;
