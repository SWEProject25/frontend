'use client';
import React from 'react';
import WhatIsHappening from './WhatIsHappening';
import WhoToFollow from './WhoToFollow';
import Footer from './Footer';
import { SearchInput } from '@/components/ui/input';

export default function RightSidebar() {
  return (
    <aside className="hidden lg:flex sticky right-0 top-0 w-full h-screen flex-col gap-4 px-4 pt-1 bg-black overflow-y-auto">
      <SearchInput placeholder="Search" />
      <WhatIsHappening />
      <WhoToFollow />
      <Footer />
    </aside>
  );
}
