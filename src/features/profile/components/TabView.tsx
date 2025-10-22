import Tabs from '@/shared/components/Tabs';
import { useState } from 'react';

const TabView = () => {
  const [selectedTab, setSelectedTab] = useState('posts');

  const tabs = [
    { title: 'Posts', value: 'posts' },
    { title: 'Replies', value: 'replies' },
    { title: 'Media', value: 'media' },
    { title: 'Likes', value: 'likes' },
  ];

  const handleTabClick = (value: string) => {
    setSelectedTab(value);
    console.log('Selected tab:', value);
  };

  return (
    <div className="w-full mt-4">
      <Tabs tabs={tabs} selectedValue={selectedTab} onClick={handleTabClick} />
      {selectedTab === 'posts' && <div>Posts Content</div>}
      {selectedTab === 'replies' && <div>Replies Content</div>}
      {selectedTab === 'media' && <div>Media Content</div>}
      {selectedTab === 'likes' && <div>Likes Content</div>}
    </div>
  );
};

export default TabView;
