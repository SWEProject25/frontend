import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/test-utils';
import { NotificationBadge } from '../NotificationBadge';
import * as notificationHooks from '../../hooks/useNotifications';

// Mock the hooks
vi.mock('../../hooks/useNotifications', () => ({
  useUnreadCount: vi.fn(),
}));

describe('NotificationBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when count is 0 by default', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    const { container } = render(<NotificationBadge />);

    expect(container.firstChild).toBeNull();
  });

  it('should render when count is greater than 0', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    render(<NotificationBadge />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render when showZero is true even if count is 0', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    render(<NotificationBadge showZero={true} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should not render when loading', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    const { container } = render(<NotificationBadge />);

    expect(container.firstChild).toBeNull();
  });

  it('should format count correctly when under maxCount', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 42,
      isLoading: false,
    } as any);

    render(<NotificationBadge maxCount={99} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should show 99+ when count exceeds maxCount', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 150,
      isLoading: false,
    } as any);

    render(<NotificationBadge maxCount={99} />);

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should show custom maxCount format', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 60,
      isLoading: false,
    } as any);

    render(<NotificationBadge maxCount={50} />);

    expect(screen.getByText('50+')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    const { container } = render(
      <NotificationBadge className="custom-class" />
    );

    const badge = container.querySelector('.custom-class');
    expect(badge).toBeInTheDocument();
  });

  it('should have correct aria-label for accessibility', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 7,
      isLoading: false,
    } as any);

    render(<NotificationBadge />);

    const badge = screen.getByLabelText('7 unread notifications');
    expect(badge).toBeInTheDocument();
  });

  it('should have correct aria-label with plural', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 100,
      isLoading: false,
    } as any);

    render(<NotificationBadge maxCount={99} />);

    const badge = screen.getByLabelText('100 unread notifications');
    expect(badge).toBeInTheDocument();
  });

  it('should exclude DM notifications by default', () => {
    const useUnreadCountSpy = vi.spyOn(notificationHooks, 'useUnreadCount');

    useUnreadCountSpy.mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    render(<NotificationBadge />);

    expect(useUnreadCountSpy).toHaveBeenCalledWith({ exclude: 'DM' });
  });

  it('should handle undefined data gracefully', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);

    const { container } = render(<NotificationBadge />);

    expect(container.firstChild).toBeNull();
  });

  it('should display single digit correctly', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 1,
      isLoading: false,
    } as any);

    render(<NotificationBadge />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display double digit correctly', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 23,
      isLoading: false,
    } as any);

    render(<NotificationBadge />);

    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('should apply default styling classes', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    const { container } = render(<NotificationBadge />);

    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-white');
    expect(badge).toHaveClass('rounded-full');
  });
});
