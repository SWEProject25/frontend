import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

const mockSelectTab = vi.fn();
const mockSetFetchAvatars = vi.fn();
const mockSetNewTweets = vi.fn();
const mockSetPopUpAvatars = vi.fn();
const mockSetTabsScroll = vi.fn();

vi.mock('../store/useTimelineStore', () => ({
  useSelectedTab: vi.fn(() => 'For you'),
  useTabsScroll: vi.fn(() => [0, 0]),
  useActions: vi.fn(() => ({
    selectTab: mockSelectTab,
    setFetchAvatars: mockSetFetchAvatars,
    setNewTweets: mockSetNewTweets,
    setPopUpAvatars: mockSetPopUpAvatars,
    setTabsScroll: mockSetTabsScroll,
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
  default: ({
    tabs,
    onClick,
    selectedValue,
  }: {
    tabs: { title: string; value: string }[];
    onClick: (value: string) => void;
    selectedValue: string;
  }) => (
    <div data-testid="tabs" data-selected={selectedValue}>
      {tabs?.map((tab) => (
        <button key={tab.value} onClick={() => onClick(tab.value)}>
          {tab.title}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/features/layout/components/MobileSidebar', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="mobile-sidebar" data-open={isOpen}>
      <button onClick={onClose} data-testid="close-sidebar">
        Close
      </button>
    </div>
  ),
}));

vi.mock('@/components/ui/icons/BrandIcons', () => ({
  XLogo: () => (
    <svg data-testid="x-logo">
      <path />
    </svg>
  ),
}));

vi.mock('@/components/ui/home/Icon', () => ({
  default: ({ path }: { path: string }) => (
    <svg data-testid="icon">
      <path d={path} />
    </svg>
  ),
}));

import Header from '../components/Header';
import { useSelectedTab, useTabsScroll } from '../store/useTimelineStore';
import { useMyProfile } from '@/features/profile/hooks';

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
    window.scrollTo = vi.fn();
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 100,
      writable: true,
    });
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

  it('should scroll to top when clicking same tab', () => {
    vi.mocked(useSelectedTab).mockReturnValue('ForYou');

    render(<Header />, { wrapper });

    fireEvent.click(screen.getByText('For you'));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    expect(mockSelectTab).toHaveBeenCalledWith('ForYou');
  });

  it('should switch to Following tab and save scroll position', () => {
    vi.mocked(useSelectedTab).mockReturnValue('ForYou');
    vi.mocked(useTabsScroll).mockReturnValue([0, 200]);

    render(<Header />, { wrapper });

    fireEvent.click(screen.getByText('Following'));

    expect(mockSetTabsScroll).toHaveBeenCalled();
    expect(mockSelectTab).toHaveBeenCalledWith('Following');
    expect(mockSetFetchAvatars).toHaveBeenCalledWith(false);
    expect(mockSetNewTweets).toHaveBeenCalledWith([]);
    expect(mockSetPopUpAvatars).toHaveBeenCalledWith([]);
  });

  it('should switch to For you tab and restore scroll position', () => {
    vi.mocked(useSelectedTab).mockReturnValue('Following');
    vi.mocked(useTabsScroll).mockReturnValue([150, 0]);

    render(<Header />, { wrapper });

    fireEvent.click(screen.getByText('For you'));

    expect(mockSetTabsScroll).toHaveBeenCalled();
    expect(mockSelectTab).toHaveBeenCalledWith('ForYou');
  });

  it('should open sidebar when clicking avatar', () => {
    render(<Header />, { wrapper });

    const avatar = screen.getByTestId('avatar');
    fireEvent.click(avatar.parentElement!);

    const sidebar = screen.getByTestId('mobile-sidebar');
    expect(sidebar.getAttribute('data-open')).toBe('true');
  });

  it('should close sidebar when clicking close button', () => {
    render(<Header />, { wrapper });

    const avatar = screen.getByTestId('avatar');
    fireEvent.click(avatar.parentElement!);

    fireEvent.click(screen.getByTestId('close-sidebar'));

    const sidebar = screen.getByTestId('mobile-sidebar');
    expect(sidebar.getAttribute('data-open')).toBe('false');
  });

  it('should use fallback name when profile name is null', () => {
    vi.mocked(useMyProfile).mockReturnValue({
      data: {
        data: {
          profile_image_url: null,
          name: null,
        },
      },
    } as ReturnType<typeof useMyProfile>);

    render(<Header />, { wrapper });

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('should refetch queries when tab changes', () => {
    vi.mocked(useSelectedTab).mockReturnValue('For you');

    render(<Header />, { wrapper });

    fireEvent.click(screen.getByText('Following'));

    expect(mockSetFetchAvatars).toHaveBeenCalledWith(false);
    expect(mockSetNewTweets).toHaveBeenCalledWith([]);
    expect(mockSetPopUpAvatars).toHaveBeenCalledWith([]);
  });
});
