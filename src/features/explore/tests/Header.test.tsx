import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockPush = vi.fn();
const mockSetSelectedTab = vi.fn();

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the store
vi.mock('../store/useExploreStore', () => ({
  useActions: () => ({
    selectTab: mockSetSelectedTab,
  }),
  useSelectedTab: vi.fn(() => 'personalized'),
}));

// Mock Tabs component
vi.mock('@/components/generic/Tabs', () => ({
  default: ({
    tabs,
    selectedValue,
    onClick,
    'data-testid': testId,
  }: {
    tabs: { title: string; value: string }[];
    selectedValue: string;
    onClick: (value: string) => void;
    'data-testid'?: string;
  }) => (
    <div data-testid={testId}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          data-testid={`tab-${tab.value}`}
          onClick={() => onClick(tab.value)}
          className={selectedValue === tab.value ? 'selected' : ''}
        >
          {tab.title}
        </button>
      ))}
    </div>
  ),
}));

// Mock SearchProfile
vi.mock('@/features/timeline/components/SearchProfile', () => ({
  default: () => <div data-testid="search-profile">Search Profile</div>,
}));

// Mock constants
vi.mock('../constants/tabs', () => ({
  exploreTabs: [
    { title: 'For You', value: 'personalized' },
    { title: 'Trending', value: 'general' },
    { title: 'News', value: 'news' },
    { title: 'Sports', value: 'sports' },
    { title: 'Entertainment', value: 'entertainment' },
  ],
}));

import Header from '../components/Header';

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header component', () => {
    render(<Header />);
    expect(screen.getByTestId('timeline-explore-header')).toBeInTheDocument();
  });

  it('should render SearchProfile component', () => {
    render(<Header />);
    expect(screen.getByTestId('search-profile')).toBeInTheDocument();
  });

  it('should render Tabs component', () => {
    render(<Header />);
    expect(screen.getByTestId('timeline-explore-tabs')).toBeInTheDocument();
  });

  it('should call router.push and setSelectedTab when tab is clicked', () => {
    render(<Header />);
    const generalTab = screen.getByTestId('tab-general');
    fireEvent.click(generalTab);

    expect(mockPush).toHaveBeenCalledWith('/explore/tabs/general');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('general');
  });

  it('should navigate to For You tab', () => {
    render(<Header />);
    const forYouTab = screen.getByTestId('tab-personalized');
    fireEvent.click(forYouTab);

    expect(mockPush).toHaveBeenCalledWith('/explore/tabs/personalized');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('personalized');
  });

  it('should navigate to News tab', () => {
    render(<Header />);
    const newsTab = screen.getByTestId('tab-news');
    fireEvent.click(newsTab);

    expect(mockPush).toHaveBeenCalledWith('/explore/tabs/news');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('news');
  });

  it('should navigate to Sports tab', () => {
    render(<Header />);
    const sportsTab = screen.getByTestId('tab-sports');
    fireEvent.click(sportsTab);

    expect(mockPush).toHaveBeenCalledWith('/explore/tabs/sports');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('sports');
  });

  it('should navigate to Entertainment tab', () => {
    render(<Header />);
    const entertainmentTab = screen.getByTestId('tab-entertainment');
    fireEvent.click(entertainmentTab);

    expect(mockPush).toHaveBeenCalledWith('/explore/tabs/entertainment');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('entertainment');
  });

  it('should have sticky positioning', () => {
    render(<Header />);
    const header = screen.getByTestId('timeline-explore-header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
  });

  it('should have backdrop blur effect', () => {
    render(<Header />);
    const header = screen.getByTestId('timeline-explore-header');
    expect(header).toHaveClass('backdrop-blur-md');
  });
});
