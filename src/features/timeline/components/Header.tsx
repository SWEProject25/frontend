'use client';

import { useState } from 'react';
import Tab from '../../../components/ui/home/Tab';

export default function Header() {
  const [selectedTab, setSelectedTab] = useState<null | number>(1);
  const tabs = [{ text: 'For you' }, { text: 'Following' }];
  const selectTab = (id: number) => setSelectedTab(id);
  return (
    <header className=" flex sticky border-b-1 border-border top-0 min-h-14 bg-black/50 backdrop-blur-md ">
      {tabs.map((tab, i) => (
        <Tab
          selected={selectedTab === i}
          onClick={selectTab}
          id={i}
          key={tab.text}
          text={tab.text}
        />
      ))}
    </header>
  );
}
