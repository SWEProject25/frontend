'use client';

import { useState } from 'react';
import Tab from '../../../components/ui/Tab';

export default function Header() {
  const [selectedTab, setSelectedTab] = useState<null | number>(1);
  const tabs = [{ text: 'For you' }, { text: 'Following' }];
  const selectTab = (id: number) => setSelectedTab(id);
  //left-[calc(50%-300px)]
  return (
    <header className="z-10 flex fixed top-0  w-[599px] border-b-1 border-border h-14 bg-black/50 backdrop-blur-md ">
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
