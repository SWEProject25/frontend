'use client';
import React from 'react';
import WhatIsHappening from './WhatIsHappening';
import WhoToFollow from './WhoToFollow';
import Footer from './Footer';
import GrokSummary from './GrokSummary';
import { SearchInput } from '@/components/ui/input';

export default function RightSidebar() {
  return (
    <aside className="hidden lg:flex sticky right-0 top-0 w-full h-screen flex-col gap-4 px-4 pt-1 bg-black ">
      <div className="z-10  flex sticky top-0 pt-[1px]  w-full h-auto bg-black/50 backdrop-blur-md ">
        <SearchInput placeholder="Search" />
      </div>
      <WhatIsHappening />
      <WhoToFollow />
      <Footer />
    </aside>
  );
}
