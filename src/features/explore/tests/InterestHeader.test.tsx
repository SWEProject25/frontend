import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockPush = vi.fn();
const mockBack = vi.fn();
const mockSetSelectedTab = vi.fn();

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock the store
vi.mock('../store/useExploreStore', () => ({
  useActions: () => ({
    selectInterestTab: mockSetSelectedTab,
  }),
  useSelectedInterestTab: vi.fn(() => 'top'),
  useInterest: vi.fn(() => 'Technology'),
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

// Mock Icon component
vi.mock('@/components/ui/home/Icon', () => ({
  default: ({ onClick }: { onClick?: () => void }) => (
    <button data-testid="back-icon" onClick={onClick}>
      Back
    </button>
  ),
}));

// Mock constants
vi.mock('../constants/tabs', () => ({
  InterestTabs: [
    { title: 'Top', value: 'top' },
    { title: 'Latest', value: 'latest' },
  ],
}));

import InterestHeader from '../components/InterestHeader';
import { useInterest } from '../store/useExploreStore';

describe('InterestHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the InterestHeader component', () => {
    render(<InterestHeader />);
    expect(screen.getByTestId('timeline-explore-header')).toBeInTheDocument();
  });

  it('should render Interest title', () => {
    render(<InterestHeader />);
    expect(screen.getByText('Interest')).toBeInTheDocument();
  });

  it('should render the interest name', () => {
    render(<InterestHeader />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('should render back button', () => {
    render(<InterestHeader />);
    expect(screen.getByTestId('back-icon')).toBeInTheDocument();
  });

  it('should call router.back when back button is clicked', () => {
    render(<InterestHeader />);
    const backButton = screen.getByTestId('back-icon');
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalled();
  });

  it('should render Tabs component', () => {
    render(<InterestHeader />);
    expect(screen.getByTestId('timeline-explore-tabs')).toBeInTheDocument();
  });

  it('should call router.push and setSelectedTab when tab is clicked', () => {
    render(<InterestHeader />);
    const latestTab = screen.getByTestId('tab-latest');
    fireEvent.click(latestTab);

    expect(mockPush).toHaveBeenCalledWith('/interests/Technology/latest');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('latest');
  });

  it('should navigate to Top tab', () => {
    render(<InterestHeader />);
    const topTab = screen.getByTestId('tab-top');
    fireEvent.click(topTab);

    expect(mockPush).toHaveBeenCalledWith('/interests/Technology/top');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('top');
  });

  it('should render info text about interests', () => {
    render(<InterestHeader />);
    expect(
      screen.getByText(
        'Posts about the Interests you follow show up in your Home Timeline'
      )
    ).toBeInTheDocument();
  });

  it('should display different interest names', () => {
    vi.mocked(useInterest).mockReturnValue('Sports');
    render(<InterestHeader />);
    expect(screen.getByText('Sports')).toBeInTheDocument();
  });

  it('should navigate correctly with different interest', () => {
    vi.mocked(useInterest).mockReturnValue('Music');
    render(<InterestHeader />);
    const latestTab = screen.getByTestId('tab-latest');
    fireEvent.click(latestTab);

    expect(mockPush).toHaveBeenCalledWith('/interests/Music/latest');
  });

  it('should have sticky header with proper styling', () => {
    render(<InterestHeader />);
    const header = screen.getByTestId('timeline-explore-header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
    expect(header).toHaveClass('backdrop-blur-md');
  });
});
