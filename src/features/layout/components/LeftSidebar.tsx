import React from 'react';
import MenuItems from './MenuItems';
import ProfileSection from './ProfileSection';
import PostButton from './PostButton';
import { XLogo } from '@/components/ui/icons';
import Link from 'next/link';

export default function LeftSidebar() {
  return (
    <aside
      data-testid="left-sidebar"
      className="sticky left-0 top-0 h-screen flex flex-col items-center min-[1400px]:items-start sm:px-2 min-[1400px]:px-4 bg-black min-[1400px]:w-[260px] w-[75px] overflow-y-auto"
    >
      <div className="flex flex-col gap-1 my-1 items-center min-[1400px]:items-start mt-2 w-full">
        {/* Logo - Always centered on small, left-aligned on 1400px+ */}
        <div
          data-testid="sidebar-logo"
          className="px-3 py-2 rounded-full hover:bg-gray-900 cursor-pointer transition-colors w-fit"
        >
          <Link href={'/home'}>
            <XLogo className="w-7 h-7 text-white" />
          </Link>
          {/* <XLogo className="w-7 h-7 text-white" /> */}
        </div>
        <MenuItems />
        <PostButton />
      </div>
      {/* Profile - Hidden on small screens, shown on xl */}
      <div className="mt-auto mb-4">
        <ProfileSection />
      </div>
    </aside>
  );
}
