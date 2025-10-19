'use client';
import React from 'react';
import WhatIsHappening from './WhatIsHappening';
import WhoToFollow from './WhoToFollow';
import Footer from './Footer';
import { SearchInput } from '@/components/ui/input';

export default function RightSidebar() {
  return (
    <aside className="hidden lg:flex sticky right-0 top-0 w-sm h-screen flex-col gap-4 px-4 pt-1  bg-black overflow-y-auto">
      <div className="px-2 mb-2 mt-2">
        <SearchInput placeholder="Search" />
      </div>
      <WhatIsHappening />
      <WhoToFollow />
      <Footer />
    </aside>
  );
}
