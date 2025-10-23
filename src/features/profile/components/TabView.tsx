import Tabs from '@/shared/components/Tabs';
import { useState } from 'react';
import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer';

const TabView = () => {
  const [selectedTab, setSelectedTab] = useState('posts');
  const [items, setItems] = useState<{ id: number; content: string }[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      content: `Item ${i + 1}`,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const tabs = [
    { title: 'Posts', value: 'posts' },
    { title: 'Replies', value: 'replies' },
    { title: 'Media', value: 'media' },
    { title: 'Likes', value: 'likes' },
  ];

  const handleTabClick = (value: string | number) => {
    setSelectedTab(value as string);
    // untill i get the real components
    setItems(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        content: `${value} Item ${i + 1}`,
      }))
    );
    setHasMore(true);
  };

  const loadMore = async () => {
    if (isLoading) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentLength = items.length;
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: currentLength + i,
      content: `${selectedTab} Item ${currentLength + i + 1}`,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setIsLoading(false);

    // Stop loading after 50 items
    if (currentLength + newItems.length >= 50) {
      setHasMore(false);
    }
  };

  const renderContent = () => {
    return (
      <InfiniteScrollContainer
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      >
        <div className="flex flex-col gap-2 py-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-border-primary rounded-lg hover:bg-hover-overlay transition-colors"
            >
              <p className="text-text-primary">{item.content}</p>
            </div>
          ))}
        </div>
      </InfiniteScrollContainer>
    );
  };

  return (
    <div className="w-full mt-4">
      <Tabs tabs={tabs} selectedValue={selectedTab} onClick={handleTabClick} />
      <div className="mt-0">{renderContent()}</div>
    </div>
  );
};

export default TabView;
