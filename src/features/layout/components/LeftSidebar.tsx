import React from 'react';
import Logo from './Logo';
import MenuItems from './MenuItems';
import ProfileSection from './ProfileSection';
import PostButton from './PostButton';

export default function LeftSidebar() {
  return (
    <aside className="sticky left-0 top-0 h-screen xl:w-2xs  flex flex-col items-center justify-between sm:px-4 bg-black border-r border-gray-800 overflow-y-auto">
      <div className="flex flex-col gap-1 my-1 items-end xl:items-start ">
        <Logo />
        <MenuItems />
        <PostButton />
      </div>
      <div className="mt-auto">
        <ProfileSection />
      </div>
    </aside>
  );
}
