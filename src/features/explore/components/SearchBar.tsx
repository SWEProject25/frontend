'use client';
import Icon from '@/components/ui/home/Icon';
import Search from '@/features/explore/components/SearchTweets';
import SearchProfile from '@/features/timeline/components/SearchProfile';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function SearchBar() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1 px-3 pt-0.5 pb-1 w-full">
      <Icon
        color="text-white"
        hoverColor="bg-input-bg-hover"
        size="w-4 h-4"
        onClick={() => router.back()}
        path="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
      />
      <SearchProfile />
    </div>
  );
}
