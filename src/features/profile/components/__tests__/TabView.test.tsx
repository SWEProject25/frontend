import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TabView from '../TabView';
import { ProfileProvider } from '@/app/[username]/ProfileProvider';

const mockUseProfileContext = vi.fn();

// Mock BlockedByUserNotice
vi.mock('../BlockedByUserNotice', () => ({
  default: ({ username }: any) => (
    <div data-testid="blocked-notice">Blocked by {username}</div>
  ),
}));

// Mock Tweets
vi.mock('../Tweets', () => ({
  default: () => <div data-testid="tweets">Tweets</div>,
}));

// Mock MediaTweets
vi.mock('../MediaTweets', () => ({
  default: () => <div data-testid="media-tweets">Media Tweets</div>,
}));

// Mock the profile store
vi.mock('../store/profileStore', () => ({
  useActions: () => ({
    selectTab: vi.fn(),
  }),
  useProfileStore: () => ({
    User: { id: 1 },
  }),

  useSelectedTab: () => 'posts',
}));

// Mock Tabs component
vi.mock('@/components/generic/Tabs', () => ({
  default: ({ tabs, selectedValue }: any) => (
    <div data-testid="tabs">
      {tabs.map((tab: any) => (
        <button key={tab.value} data-selected={tab.value === selectedValue}>
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: vi.fn((selector) => {
    const state = { user: { id: 1 } };
    return selector ? selector(state) : state;
  }),
}));

vi.mock('@/app/[username]/ProfileProvider', () => ({
  ProfileProvider: ({ children }: any) => <>{children}</>,
  useProfileContext: () => mockUseProfileContext(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ProfileProvider params={Promise.resolve({ username: 'ahmed' })}>
      {children}
    </ProfileProvider>
  </QueryClientProvider>
);

describe('TabView', () => {
  beforeEach(() => {
    mockUseProfileContext.mockReturnValue({
      profile: { User: { id: 1 } },
    });
  });

  it('should render tab view container', () => {
    const { container } = render(<TabView />, { wrapper });
    expect(
      container.querySelector('[data-testid="profile-tab-view"]')
    ).toBeInTheDocument();
  });

  it('should render tabs component', () => {
    render(<TabView />, { wrapper });
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('should show BlockedByUserNotice when profile.is_been_blocked is true', () => {
    mockUseProfileContext.mockReturnValue({
      profile: {
        User: { id: 2, username: 'blockeduser' },
        is_been_blocked: true,
      },
    });

    render(<TabView />, { wrapper });

    expect(screen.getByTestId('blocked-notice')).toBeInTheDocument();
    expect(screen.getByText('Blocked by blockeduser')).toBeInTheDocument();
  });
});
