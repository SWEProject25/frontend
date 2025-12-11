import React from 'react';
import Trendings from './Trendings';
import TweetsList from './TweetsList';
import WhoToFollow from '@/features/layout/components/WhoToFollow';

export default function ForYou() {
  return (
    <div className="flex flex-col flex-1">
      <Trendings />
      {/* <WhoToFollow />  change it wthout the flex */}
      <TweetsList />
    </div>
  );
}
