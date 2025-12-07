import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TabView from '../TabView';
import { ProfileProvider } from '@/app/[username]/ProfileProvider';

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
  useProfileContext: () => ({ profile: { User: { id: 1 } } }),
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
});
