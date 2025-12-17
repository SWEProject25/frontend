import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/test-utils';
import NotificationsPage from '../page';

// Mock LayoutWrapper to just render children without authentication
vi.mock('@/features/layout/components/LayoutWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/notifications',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the components and hooks
vi.mock('@/features/notifications/components', () => ({
  NotificationList: ({ params, emptyMessage }: any) => (
    <div data-testid="notification-list">
      <div data-testid="params">{JSON.stringify(params)}</div>
      <div data-testid="empty-message">{emptyMessage}</div>
    </div>
  ),
}));

const mockUsePageTitleNotifications = vi.fn();
vi.mock('@/features/notifications/hooks', () => ({
  usePageTitleNotifications: (...args: any[]) =>
    mockUsePageTitleNotifications(...args),
}));

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page title', () => {
    render(<NotificationsPage />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('should render tabs for "All" and "Mentions"', () => {
    render(<NotificationsPage />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Mentions')).toBeInTheDocument();
  });

  it('should have "All" tab active by default', () => {
    render(<NotificationsPage />);

    const allTab = screen.getByText('All').closest('button');
    const mentionsTab = screen.getByText('Mentions').closest('button');

    expect(allTab).toHaveClass('font-bold', 'text-foreground');
    expect(mentionsTab).toHaveClass('text-secondary');
  });

  it('should show active indicator on "All" tab by default', () => {
    render(<NotificationsPage />);

    const allTab = screen.getByText('All').closest('button');
    const indicator = allTab?.querySelector('.bg-primary');

    expect(indicator).toBeInTheDocument();
  });

  it('should switch to "Mentions" tab when clicked', () => {
    render(<NotificationsPage />);

    const mentionsTab = screen.getByText('Mentions');
    fireEvent.click(mentionsTab);

    const mentionsButton = mentionsTab.closest('button');
    expect(mentionsButton).toHaveClass('font-bold', 'text-foreground');
  });

  it('should show active indicator on "Mentions" tab when active', () => {
    render(<NotificationsPage />);

    const mentionsTab = screen.getByText('Mentions');
    fireEvent.click(mentionsTab);

    const mentionsButton = mentionsTab.closest('button');
    const indicator = mentionsButton?.querySelector('.bg-primary');

    expect(indicator).toBeInTheDocument();
  });

  it('should switch back to "All" tab when clicked', () => {
    render(<NotificationsPage />);

    // Click Mentions first
    const mentionsTab = screen.getByText('Mentions');
    fireEvent.click(mentionsTab);

    // Click All
    const allTab = screen.getByText('All');
    fireEvent.click(allTab);

    const allButton = allTab.closest('button');
    expect(allButton).toHaveClass('font-bold', 'text-foreground');
  });

  it('should pass correct params to NotificationList for "All" tab', () => {
    render(<NotificationsPage />);

    const params = screen.getByTestId('params');
    expect(params.textContent).toBe(JSON.stringify({ exclude: 'DM' }));
  });

  it('should pass correct params to NotificationList for "Mentions" tab', () => {
    render(<NotificationsPage />);

    const mentionsTab = screen.getByText('Mentions');
    fireEvent.click(mentionsTab);

    const params = screen.getByTestId('params');
    expect(params.textContent).toBe(JSON.stringify({ include: 'MENTION' }));
  });

  it('should show correct empty message for "All" tab', () => {
    render(<NotificationsPage />);

    const emptyMessage = screen.getByTestId('empty-message');
    expect(emptyMessage.textContent).toBe('No notifications yet');
  });

  it('should show correct empty message for "Mentions" tab', () => {
    render(<NotificationsPage />);

    const mentionsTab = screen.getByText('Mentions');
    fireEvent.click(mentionsTab);

    const emptyMessage = screen.getByTestId('empty-message');
    expect(emptyMessage.textContent).toBe('No mentions yet');
  });

  it('should call usePageTitleNotifications with correct parameters', () => {
    render(<NotificationsPage />);

    expect(mockUsePageTitleNotifications).toHaveBeenCalledWith('H', false);
  });

  it('should render NotificationList component', () => {
    render(<NotificationsPage />);

    expect(screen.getByTestId('notification-list')).toBeInTheDocument();
  });

  it('should have sticky header with backdrop blur', () => {
    const { container } = render(<NotificationsPage />);

    const header = container.querySelector('.sticky');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('backdrop-blur-md');
  });

  it('should have proper styling for tabs', () => {
    render(<NotificationsPage />);

    const allTab = screen.getByText('All').closest('button');
    const mentionsTab = screen.getByText('Mentions').closest('button');

    expect(allTab).toHaveClass('flex-1');
    expect(mentionsTab).toHaveClass('flex-1');
  });

  it('should have hover effect on tabs', () => {
    render(<NotificationsPage />);

    const allTab = screen.getByText('All').closest('button');
    expect(allTab).toHaveClass('hover:bg-white/10');
  });

  it('should maintain tab state when switching multiple times', () => {
    render(<NotificationsPage />);

    const allTab = screen.getByText('All');
    const mentionsTab = screen.getByText('Mentions');

    // Switch to Mentions
    fireEvent.click(mentionsTab);
    let params = screen.getByTestId('params');
    expect(params.textContent).toBe(JSON.stringify({ include: 'MENTION' }));

    // Switch back to All
    fireEvent.click(allTab);
    params = screen.getByTestId('params');
    expect(params.textContent).toBe(JSON.stringify({ exclude: 'DM' }));

    // Switch to Mentions again
    fireEvent.click(mentionsTab);
    params = screen.getByTestId('params');
    expect(params.textContent).toBe(JSON.stringify({ include: 'MENTION' }));
  });

  it('should render with proper layout structure', () => {
    const { container } = render(<NotificationsPage />);

    const mainContainer = container.querySelector(
      '.flex.min-h-screen.flex-col'
    );
    expect(mainContainer).toBeInTheDocument();
  });

  it('should render border on header', () => {
    const { container } = render(<NotificationsPage />);

    const header = container.querySelector('.border-b.border-border');
    expect(header).toBeInTheDocument();
  });

  it('should have correct z-index for header', () => {
    const { container } = render(<NotificationsPage />);

    const header = container.querySelector('.sticky');
    expect(header).toHaveClass('z-10');
  });

  it('should display title with correct styling', () => {
    render(<NotificationsPage />);

    const title = screen.getByText('Notifications');
    expect(title).toHaveClass('text-xl', 'font-bold', 'text-foreground');
  });

  it('should position active indicator at the bottom of tab', () => {
    render(<NotificationsPage />);

    const allTab = screen.getByText('All').closest('button');
    const indicator = allTab?.querySelector('.absolute.bottom-0');

    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('h-1');
  });
});
