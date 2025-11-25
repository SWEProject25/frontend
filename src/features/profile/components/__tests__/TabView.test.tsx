import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TabView from '../TabView';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
