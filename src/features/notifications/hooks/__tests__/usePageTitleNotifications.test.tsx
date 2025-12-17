import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { usePageTitleNotifications } from '../usePageTitleNotifications';
import * as notificationHooks from '../useNotifications';
import * as faviconLib from '../../lib/favicon';

// Mock dependencies
vi.mock('../useNotifications', () => ({
  useUnreadCount: vi.fn(),
}));

vi.mock('../../lib/favicon', () => ({
  setNotificationFavicon: vi.fn(),
  resetFavicon: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('usePageTitleNotifications', () => {
  let originalTitle: string;
  let originalPathname: string;

  beforeEach(() => {
    originalTitle = document.title;
    originalPathname = window.location.pathname;
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.title = originalTitle;
    // Reset pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: originalPathname },
      writable: true,
    });
  });

  it('should update page title with unread count when there are notifications', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('(5) Home / H');
  });

  it('should not update title when unread count is 0', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('Home / H');
  });

  it('should not update title when unread count is undefined', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('Home / H');
  });

  it('should update title correctly for notifications page', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 3,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/notifications' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('(3) Notifications / H');
  });

  it('should update title correctly for messages page', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 7,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/messages' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('(7) Messages / H');
  });

  it('should use base title for unknown pages', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 2,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/unknown' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('(2) H');
  });

  it('should update favicon when there are notifications', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    const setNotificationFaviconSpy = vi.spyOn(
      faviconLib,
      'setNotificationFavicon'
    );

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(setNotificationFaviconSpy).toHaveBeenCalled();
  });

  it('should reset favicon when there are no notifications', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    const resetFaviconSpy = vi.spyOn(faviconLib, 'resetFavicon');

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(resetFaviconSpy).toHaveBeenCalled();
  });

  it('should not update favicon when updateFavicon is false', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    const setNotificationFaviconSpy = vi.spyOn(
      faviconLib,
      'setNotificationFavicon'
    );

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('H', false), {
      wrapper: createWrapper(),
    });

    expect(setNotificationFaviconSpy).not.toHaveBeenCalled();
  });

  it('should use default base title when not provided', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/unknown' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications(), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('H');
  });

  it('should exclude DM notifications from count', () => {
    const useUnreadCountSpy = vi.spyOn(notificationHooks, 'useUnreadCount');

    useUnreadCountSpy.mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(useUnreadCountSpy).toHaveBeenCalledWith({ exclude: 'DM' });
  });

  it('should reset title and favicon on unmount', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    const resetFaviconSpy = vi.spyOn(faviconLib, 'resetFavicon');

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    const { unmount } = renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('(5) Home / H');

    unmount();

    expect(document.title).toBe('H');
    expect(resetFaviconSpy).toHaveBeenCalled();
  });

  it('should not reset favicon on unmount if updateFavicon is false', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 5,
      isLoading: false,
    } as any);

    const resetFaviconSpy = vi.spyOn(faviconLib, 'resetFavicon');

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    const { unmount } = renderHook(
      () => usePageTitleNotifications('H', false),
      {
        wrapper: createWrapper(),
      }
    );

    resetFaviconSpy.mockClear(); // Clear initial calls

    unmount();

    // Should still be called in cleanup but only once
    expect(resetFaviconSpy).not.toHaveBeenCalled();
  });

  it('should return unread count', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 10,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    const { result } = renderHook(() => usePageTitleNotifications('H', true), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe(10);
  });

  it('should update title when unread count changes', () => {
    const useUnreadCountSpy = vi.spyOn(notificationHooks, 'useUnreadCount');

    useUnreadCountSpy.mockReturnValue({
      data: 3,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/home' },
      writable: true,
    });

    const { rerender } = renderHook(
      () => usePageTitleNotifications('H', true),
      {
        wrapper: createWrapper(),
      }
    );

    expect(document.title).toBe('(3) Home / H');

    // Update count
    useUnreadCountSpy.mockReturnValue({
      data: 8,
      isLoading: false,
    } as any);

    rerender();

    expect(document.title).toBe('(8) Home / H');
  });

  it('should handle custom base title', () => {
    vi.spyOn(notificationHooks, 'useUnreadCount').mockReturnValue({
      data: 4,
      isLoading: false,
    } as any);

    Object.defineProperty(window, 'location', {
      value: { pathname: '/unknown' },
      writable: true,
    });

    renderHook(() => usePageTitleNotifications('MyApp', true), {
      wrapper: createWrapper(),
    });

    expect(document.title).toBe('(4) MyApp');
  });
});
