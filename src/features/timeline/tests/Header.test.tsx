import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock('@/features/explore/store/useExploreStore', () => ({
  useSearchExplore: vi.fn(() => ''),
  useActions: vi.fn(() => ({ setSearchQuery: vi.fn() })),
}));

vi.mock('../store/useTimelineStore', () => ({
  useSelectedTab: vi.fn(() => 'forYou'),
  useTabsScroll: vi.fn(() => [0, 0]),
  useActions: vi.fn(() => ({
    selectTab: vi.fn(),
    setFetchAvatars: vi.fn(),
    setNewTweets: vi.fn(),
    setPopUpAvatars: vi.fn(),
    setTabsScroll: vi.fn(),
  })),
}));

vi.mock('@/features/authentication/store/useAuthStore', () => ({
  default: vi.fn(() => ({ avatar: '/avatar.jpg', username: 'testuser' })),
  useAuthStore: vi.fn(() => ({ avatar: '/avatar.jpg', username: 'testuser' })),
  useUser: vi.fn(() => ({ avatar: '/avatar.jpg', username: 'testuser' })),
}));

vi.mock('@/features/profile/hooks', () => ({
  useMyProfile: vi.fn(() => ({
    data: {
      data: {
        profile_image_url: 'https://example.com/avatar.jpg',
        name: 'Test User',
      },
    },
  })),
}));

vi.mock('@/components/generic/Avatar', () => ({
  default: function Avatar({
    avatarImage,
    name,
    size,
  }: {
    avatarImage: string;
    name: string;
    size: string;
  }) {
    return (
      <div
        data-testid="avatar"
        data-src={avatarImage}
        data-alt={name}
        data-size={size}
      />
    );
  },
}));

vi.mock('@/components/generic/Tabs', () => ({
  default: ({ tabs }: any) => (
    <div data-testid="tabs">
      {tabs?.map((tab: any) => (
        <div key={tab.value}>{tab.title}</div>
      ))}
    </div>
  ),
}));

vi.mock('@/features/layout/components/MobileSidebar', () => ({
  default: () => <div data-testid="mobile-sidebar">MobileSidebar</div>,
}));

vi.mock('@/components/ui/icons/BrandIcons', () => ({
  XLogo: () => (
    <svg data-testid="x-logo">
      <path />
    </svg>
  ),
}));

vi.mock('@/components/ui/home/Icon', () => ({
  default: ({ path }: any) => (
    <svg data-testid="icon">
      <path d={path} />
    </svg>
  ),
}));

import Header from '../components/Header';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header component', () => {
    render(<Header />, { wrapper });
    expect(screen.getByTestId('timeline-header')).toBeInTheDocument();
  });

  it('should render For You tab', () => {
    render(<Header />, { wrapper });
    expect(screen.getByText('For you')).toBeInTheDocument();
  });

  it('should render Following tab', () => {
    render(<Header />, { wrapper });
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('should render avatar', () => {
    render(<Header />, { wrapper });
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('should render tabs component', () => {
    render(<Header />, { wrapper });
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('should have correct header structure', () => {
    const { container } = render(<Header />, { wrapper });
    expect(
      container.querySelector('[data-testid="timeline-header"]')
    ).toBeDefined();
  });

  it('should render mobile sidebar component', () => {
    render(<Header />, { wrapper });
    expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
  });

  it('should render X logo', () => {
    render(<Header />, { wrapper });
    expect(screen.getByTestId('x-logo')).toBeInTheDocument();
  });
});
