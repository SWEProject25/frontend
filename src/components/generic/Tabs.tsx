import React from 'react';
import Tab from '@/components/ui/Tab';

interface TabItem {
  title: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  selectedValue: string | number;
  onClick: (value: string) => void;
  height: string;
}

export default function Tabs({
  tabs,
  selectedValue,
  onClick,
  height,
}: TabsProps) {
  return (
    <div className={`flex w-full border-b border-border ${height}`}>
      {tabs.map((tab, index) => (
        <Tab
          key={tab.value}
          text={tab.title}
          id={index}
          selected={tab.value === selectedValue}
          onClick={() => onClick(tab.value)}
        />
      ))}
    </div>
  );
}
