import React from 'react';
import MenuItems from './MenuItems';
import ProfileSection from './ProfileSection';
import PostButton from './PostButton';
import { XLogo } from '@/components/ui/icons';

export default function LeftSidebar() {
  return (
    <aside className="sticky left-0 top-0 h-screen flex flex-col items-center xl:items-start sm:px-2 xl:px-4 bg-black border-r border-gray-800 overflow-y-auto">
      <div className="flex flex-col gap-1 my-1 items-center xl:items-start mt-2 w-full">
        {/* Logo - Always centered on small, left-aligned on xl */}
        <div className="px-3 py-2 rounded-full hover:bg-gray-900 cursor-pointer transition-colors w-fit">
          <XLogo className="w-7 h-7 text-white" />
        </div>
        <MenuItems />
        <PostButton />
      </div>
      {/* Profile - Hidden on small screens, shown on xl */}
      <div className="mt-auto mb-4 w-full">
        <ProfileSection />
      </div>
    </aside>
  );
}
