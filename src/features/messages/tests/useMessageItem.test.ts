import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMessageItem } from '../components/MessageItem/useMessageItem';

describe('useMessageItem', () => {
  const mockMessage = {
    id: 1,
    senderId: 123,
    conversationId: 456,
    text: 'Test message',
    isSeen: false,
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2025-12-15T10:00:00Z',
  };

  it('should initialize with showMenu as false', () => {
    const { result } = renderHook(() => useMessageItem(mockMessage, vi.fn()));

    expect(result.current.showMenu).toBe(false);
  });

  it('should toggle menu when toggleMenu is called', () => {
    const { result } = renderHook(() => useMessageItem(mockMessage, vi.fn()));

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.showMenu).toBe(true);

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.showMenu).toBe(false);
  });

  it('should close menu when closeMenu is called', () => {
    const { result } = renderHook(() => useMessageItem(mockMessage, vi.fn()));

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.showMenu).toBe(true);

    act(() => {
      result.current.closeMenu();
    });

    expect(result.current.showMenu).toBe(false);
  });

  it('should call onDelete with message id and close menu when handleDelete is called', () => {
    const onDelete = vi.fn();
    const { result } = renderHook(() => useMessageItem(mockMessage, onDelete));

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.showMenu).toBe(true);

    act(() => {
      result.current.handleDelete();
    });

    expect(onDelete).toHaveBeenCalledWith(mockMessage.id);
    expect(result.current.showMenu).toBe(false);
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() =>
      useMessageItem(mockMessage, vi.fn())
    );

    const firstToggleMenu = result.current.toggleMenu;
    const firstCloseMenu = result.current.closeMenu;

    rerender();

    expect(result.current.toggleMenu).toBe(firstToggleMenu);
    expect(result.current.closeMenu).toBe(firstCloseMenu);
  });

  it('should handle multiple toggle operations correctly', () => {
    const { result } = renderHook(() => useMessageItem(mockMessage, vi.fn()));

    // Toggle multiple times
    act(() => {
      result.current.toggleMenu();
      result.current.toggleMenu();
      result.current.toggleMenu();
    });

    expect(result.current.showMenu).toBe(true);
  });
});
