import React from 'react';
import MenuItems from './MenuItems';
import ProfileSection from './ProfileSection';
import PostButton from './PostButton';
import { XLogo } from '@/components/ui/icons';

export default function LeftSidebar() {
  return (
    <aside className="sticky left-0 top-0 h-screen xl:w-2xs  flex flex-col items-center justify-between sm:px-4 bg-black border-r border-gray-800 overflow-y-auto">
      <div className="flex flex-col gap-1 my-1 items-center xl:items-start mt-2">
        <div className=" px-3 py-2 rounded-full hover:bg-color-secondary cursor-pointer transition-colors w-fit">
          <XLogo className="w-8 h-8 text-text-active" />
        </div>
        <MenuItems />
        <PostButton />
      </div>
      <div className="mt-auto">
        <ProfileSection />
      </div>
    </aside>
  );
}
