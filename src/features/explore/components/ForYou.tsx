import React from 'react';
import Trendings from './Trendings';
import TweetsList from './TweetsList';

export default function ForYou() {
  return (
    <div className="flex flex-col flex-1">
      <Trendings />
      <TweetsList />
    </div>
  );
}
